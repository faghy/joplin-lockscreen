import { SettingItemType } from 'api/types';
const crypto = require('crypto');
const os = require('os');

declare const joplin: any;
let lockDialog: any = null;
joplin.plugins.register({

    onStart: async function () {

        console.log('Lock Screen Plugin started');

        // Sezione impostazioni
        await joplin.settings.registerSection('lockScreen', {
            label: 'Lock Screen',
            iconName: 'fas fa-lock',
        });

        lockDialog = await joplin.views.dialogs.create('lockScreenDialog');

        await joplin.settings.registerSettings({
            'lockEnabled': {
                value: false,
                type: SettingItemType.Bool,
                section: 'lockScreen',
                public: true,
                label: "Abilita blocco all'avvio",
            },
            'passwordHash': {
                value: '',
                type: SettingItemType.String,
                section: 'lockScreen',
                public: true,
                label: 'Imposta password (inserisci qui e clicca OK nelle opzioni)',
                description: 'Inserisci la tua password qui. Verrà convertita in hash quando salvi le opzioni.',
            },
            'lockOnLinuxOnly': {
                value: false,
                type: SettingItemType.Bool,
                section: 'lockScreen',
                public: true,
                label: 'Attiva solo su Linux',
            },
        });

        // Listener impostazioni
        await joplin.settings.onChange(async (event: any) => {
            const passwordHash = await joplin.settings.value('passwordHash');

            // Se l'utente ha inserito una password in chiaro (non hash SHA-256)
            if (passwordHash && passwordHash.length > 0 && passwordHash.length !== 64) {
                console.log('Converting password to hash...');
                const hash = crypto.createHash('sha256').update(passwordHash).digest('hex');
                await joplin.settings.setValue('passwordHash', hash);
                await joplin.settings.setValue('lockEnabled', true);
                console.log('Password hash saved');
            }
        });

        // Comando "Blocca ora"
        await joplin.commands.register({
            name: 'lockNow',
            label: 'Blocca Joplin Ora',
            execute: async () => {
                const hash = await joplin.settings.value('passwordHash');
                if (!hash || hash.length !== 64) {
                    await joplin.views.dialogs.showMessageBox(
                        'Imposta prima una password in:\nStrumenti → Opzioni → Lock Screen'
                    );
                    return;
                }
                await showLockScreen(hash);
            },
        });

        await joplin.views.menuItems.create('lockNowMenu', 'lockNow', 'tools');

        // Controllo all'avvio
        const platform = os.platform();
        const lockOnLinuxOnly = await joplin.settings.value('lockOnLinuxOnly');
        const lockEnabled = await joplin.settings.value('lockEnabled');
        const passwordHash = await joplin.settings.value('passwordHash');

        console.log('Startup check:', {
            lockEnabled,
            hasHash: passwordHash && passwordHash.length === 64,
        });

        const shouldLock =
            lockEnabled &&
            passwordHash &&
            passwordHash.length === 64 &&
            (!lockOnLinuxOnly || platform === 'linux');

        if (shouldLock) {
            setTimeout(() => {
                joplin.commands.execute('lockNow');
            }, 1000);
        }
    },
});

async function showLockScreen(correctHash: string) {
    const crypto = await import('crypto');
    const dialogs = joplin.views.dialogs;

    const dialog = lockDialog;

    await dialogs.setFitToContent(dialog, false);

    async function render(errorMessage: string = '') {
        await dialogs.setHtml(dialog, `
            <div style="
                min-width: 800px;
                min-height: 600px;
                padding: 80px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
            ">
                <div style="
                    background: white;
                    padding: 60px 80px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    min-width: 450px;
                ">
                    <div style="font-size: 72px; margin-bottom: 20px;">🔒</div>
                    <h2 style="margin: 0 0 10px 0; font-size: 32px; color: #333;">Joplin Bloccato</h2>
                    <p style="color: #666; font-size: 18px; margin: 0 0 40px 0;">
                        Inserisci la password per continuare
                    </p>
                    <form name="mainForm">
                        <input name="pwd" type="password" 
                            placeholder="Password"
                            autofocus
                            style="
                                width: 100%;
                                padding: 16px 20px;
                                font-size: 18px;
                                border: 2px solid #e0e0e0;
                                border-radius: 10px;
                                box-sizing: border-box;
                            " />
                        <div style="
                            color: #e53e3e;
                            min-height: 30px;
                            margin-top: 20px;
                            font-size: 16px;
                            font-weight: 500;
                        ">
                            ${errorMessage}
                        </div>
                    </form>
                </div>
            </div>
        `);
    }

    await dialogs.setButtons(dialog, [
        { id: 'ok', title: 'Sblocca' }
    ]);

    let unlocked = false;

    while (!unlocked) {
        await render();

        const result = await dialogs.open(dialog);

        if (result.id !== 'ok') continue;

        console.log("FORM DATA:", result.formData);

        const password = result.formData?.mainForm?.pwd || '';
        const inputHash = crypto.createHash('sha256').update(password).digest('hex');

        if (inputHash === correctHash) {
            unlocked = true;
            await dialogs.close(dialog);
        } else {
            await render('Password errata!');
        }
    }
}