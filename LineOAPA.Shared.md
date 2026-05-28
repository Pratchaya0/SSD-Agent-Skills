1. Install packages
Run this command to download LineOAPA.Shared.dll into the Contracts folder next to your .csproj.
Details:
gh release download v1.1.0 -R SiamsmileDev/LineOAPASAdmin_API -p LineOAPA.Shared.zip
Repo is private — use gh only, not plain curl.

Workspace = repo root (cwd). It is the folder that contains the .sln file. Stay here — do not cd into subfolders.
PROJECT = folder that contains the .csproj, relative to workspace (find it first — do not guess).
Final DLL: {PROJECT}/Contracts/LineOAPA.Shared.dll (only the .dll — no subfolders, no .zip, no .pdb).

How to set PROJECT:
```
ls *.sln                    # confirm workspace (repo root)
ls */*.csproj               # project folder = the directory name before .csproj
# Example: TestSkills.API/TestSkills.API.csproj → PROJECT=TestSkills.API
# Example: LineOAPASAPI/LineOAPASAPI.csproj     → PROJECT=LineOAPASAPI
# Example: MyApi.csproj at root                 → PROJECT=.
```

Path rules (any project):
| mkdir command | When | Result |
|---|---|---|
| mkdir $PROJECT/Contracts | workspace has .sln, PROJECT=folder with .csproj | CORRECT |
| mkdir Contracts | PROJECT is a subfolder, not workspace root | WRONG — creates Contracts at repo root |
| mkdir $PROJECT/$PROJECT/Contracts | already inside PROJECT folder | WRONG — double nested |

Example (TestSkills.API — repo and project folder share the same name):
```
{workspace}/TestSkills.API.sln
{workspace}/Contracts/                         ← WRONG
{workspace}/TestSkills.API/TestSkills.API.csproj
{workspace}/TestSkills.API/Contracts/LineOAPA.Shared.dll   ← CORRECT
{workspace}/TestSkills.API/TestSkills.API/Contracts/       ← WRONG
```
Code:
File: Code
```
# Step 1 — detect workspace and PROJECT
pwd
ls *.sln
ls */*.csproj
PROJECT=TestSkills.API

# Step 2 — delete wrong Contracts folders
rm -rf ./Contracts
rm -rf ./$PROJECT/$PROJECT

# Step 3 — download
mkdir -p $PROJECT/Contracts
gh release download v1.1.0 -R SiamsmileDev/LineOAPASAdmin_API -p LineOAPA.Shared.zip -D .
tar -xf LineOAPA.Shared.zip -C $PROJECT/Contracts
mv $PROJECT/Contracts/LineOAPA.Shared/LineOAPA.Shared.dll $PROJECT/Contracts/ 2>/dev/null || true
rm -rf $PROJECT/Contracts/LineOAPA.Shared
rm -f $PROJECT/Contracts/*.pdb LineOAPA.Shared.zip

# Step 4 — verify
ls -la $PROJECT/Contracts/LineOAPA.Shared.dll
```

2. Add files
Add the DLL reference, enable Masstransit RabbitMQ, and register request clients in ProjectSetup.
Details:
Replace {ProjectFolder} with your PROJECT folder name from step 1.
All paths below are relative to workspace (repo root).
Append to existing files only. Change only what is listed below.
Do not edit Startup.cs if services.AddMassTransit already exists.
Do not edit TODO comments or unrelated lines in ProjectSetup.cs.
Do not change other ItemGroup entries in the .csproj.
Do not delete KafkaSetting — patch EnableRabbitMQ and Port only.
Do not create YourService.cs unless asked.
Code:
File: {ProjectFolder}/{ProjectFolder}.csproj
Example: TestSkills.API/TestSkills.API.csproj or LineOAPASAPI/LineOAPASAPI.csproj
```
<ItemGroup>
  <Reference Include="LineOAPA.Shared">
    <HintPath>Contracts\LineOAPA.Shared.dll</HintPath>
  </Reference>
</ItemGroup>
```

File: {ProjectFolder}/appsettings.json
```
"EnableRabbitMQ": true,
"Port": 5672,
```

File: {ProjectFolder}/ProjectSetup.cs
```
using LineOAPA.Shared;

configure.AddRequestClient<LinkUserToAccessRichMenu>();
configure.AddRequestClient<UnlinkUserFromAccessRichMenu>();
configure.AddRequestClient<RequestSendMessagesToUsers>();
```

3. Verify build
Run dotnet build and confirm the DLL is at the correct path.
Details:
dotnet build {ProjectFolder}/{ProjectFolder}.csproj
Code:
File: Code
```
PROJECT=TestSkills.API

dotnet build $PROJECT/$PROJECT.csproj
test -f $PROJECT/Contracts/LineOAPA.Shared.dll
! test -d ./Contracts
! test -d $PROJECT/$PROJECT
ls $PROJECT/Contracts/
```
