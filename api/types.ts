export enum SettingItemType {
  Int = 1,
  String = 2,
  Bool = 3,
  Array = 4,
  Object = 5,
}

export enum ContentScriptType {
  CodeMirrorPlugin = 'codeMirrorPlugin',
  MarkdownItPlugin = 'markdownItPlugin',
}

export interface SettingItem {
  value: any;
  type: SettingItemType;
  public: boolean;
  label: string;
  section?: string;
  description?: string;
}
