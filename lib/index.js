import { NativeModules } from 'react-native';
import { decode_imap_utf7 } from './utf7/utf7';
const { RNMailCore } = NativeModules;
class MailInstance {
    constructor(imapCfg, smtpCfg) {
        this.mUserCredentials = null;
        this.mFolders = [];
        this.mLoggedIn = false;
        this.mIMAPConfig = imapCfg;
        this.mSMTPConfig = smtpCfg;
    }
    get LoggedIn() { return this.mLoggedIn; }
    Login(creds) {
        this.mUserCredentials = creds;
        return RNMailCore.loginImap({
            hostname: this.mIMAPConfig.hostname,
            port: this.mIMAPConfig.port,
            username: this.mUserCredentials.username,
            password: this.mUserCredentials.password,
        }).then(() => {
            return RNMailCore.loginSmtp({
                hostname: this.mSMTPConfig.hostname,
                port: this.mSMTPConfig.port,
                username: this.mUserCredentials.username,
                password: this.mUserCredentials.password,
            }).then(() => {
                this.mLoggedIn = true;
                return Promise.resolve();
            });
        });
    }
    FetchFolders() {
        return RNMailCore.getFolders().then((folders) => {
            this.mFolders = folders;
            for (let folder of this.mFolders)
                folder.name = decode_imap_utf7(folder.path);
            return Promise.resolve(folders);
        });
    }
    GetFolders() {
        if (this.mFolders.length)
            return Promise.resolve(this.mFolders);
        return this.FetchFolders();
    }
    //public CreateFolder(folderName: string): Promise<void> {
    //  return RNMailModule.CreateFolder(folderName).then(()=>{
    //    return this.FetchFolders().then(()=>{
    //      return Promise.resolve()
    //    })
    //  })
    //}
    //public RenameFolder(folderName: string, folderNewName: string): Promise<void> {
    //  return RNMailModule.RenameFolder({old: folderName, 'new': folderNewName})
    //}
    GetMails(folder, requestKind, lastLocalUID) {
        return RNMailCore.getMails({ folder: folder.path, requestKind: requestKind, lastUID: lastLocalUID });
    }
    GetMail(folderPath, requestKind) {
        return RNMailCore.getMail({ folder: folderPath, requestKind });
    }
    GetAttachment(fileName, folder, messageUID) {
        return RNMailCore.getAttachment({ filename: fileName, folder: folder.path, messageId: messageUID });
    }
}
export default MailInstance;
//# sourceMappingURL=index.js.map