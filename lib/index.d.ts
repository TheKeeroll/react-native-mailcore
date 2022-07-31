import { Folder, Mail, MailHeader, ServerConfiguration, UserCredentials, Nullable } from './Types';
declare class MailInstance {
    private readonly mIMAPConfig;
    private readonly mSMTPConfig;
    private mUserCredentials;
    private mFolders;
    private mLoggedIn;
    constructor(imapCfg: ServerConfiguration, smtpCfg: ServerConfiguration);
    get LoggedIn(): boolean;
    Login(creds: UserCredentials): Promise<void>;
    FetchFolders(): Promise<Folder[]>;
    GetFolders(): Promise<Nullable<Folder[]>>;
    GetMails(folder: Folder, requestKind: number, lastLocalUID?: number): Promise<MailHeader[]>;
    GetMail(folderPath: string, requestKind: number): Promise<Mail>;
    GetAttachment(fileName: string, folder: Folder, messageUID: number): Promise<any>;
}
export default MailInstance;
