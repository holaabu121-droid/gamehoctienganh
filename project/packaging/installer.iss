#ifndef AppVersion
  #define AppVersion "1.2.0"
#endif

#define AppName "English Quest"
#define AppExeName "EnglishQuest.exe"
#define ProjectRoot AddBackslash(SourcePath) + ".."

[Setup]
AppId={{73AE27B3-E65D-4897-8437-7BC68BA65D2C}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher=English Quest Family
DefaultDirName={localappdata}\Programs\EnglishQuest
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputDir={#ProjectRoot}\release
OutputBaseFilename=EnglishQuest-Setup-{#AppVersion}
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayIcon={app}\{#AppExeName}
CloseApplications=yes
CloseApplicationsFilter={#AppExeName}
RestartApplications=no
SetupLogging=yes
VersionInfoVersion={#AppVersion}
VersionInfoProductName={#AppName}
VersionInfoDescription=Bộ cài English Quest

[Files]
Source: "{#ProjectRoot}\build\windows\EnglishQuest\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#AppName}"; Filename: "{app}\{#AppExeName}"; WorkingDir: "{app}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExeName}"; WorkingDir: "{app}"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Tạo biểu tượng English Quest ngoài màn hình"; GroupDescription: "Biểu tượng bổ sung:"; Flags: checkedonce

[Run]
Filename: "{app}\{#AppExeName}"; Description: "Mở {#AppName}"; Flags: nowait postinstall skipifsilent

[Messages]
WelcomeLabel1=Chào mừng đến với bộ cài [name]
WelcomeLabel2=Ứng dụng sẽ được cài cho tài khoản Windows hiện tại.%n%nĐiểm và tài khoản học sinh được lưu riêng trong Local AppData nên không bị xóa khi nâng cấp hoặc gỡ ứng dụng.
