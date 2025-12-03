# Wireframe game prototype

Open world Wireframe 3D game for PC and Playdate

# Resources

https://www.dafont.com/volter-goldfish.font
https://www.dafont.com/zx-spectrum.font

# Config Playdate

.bashrc
export PLAYDATE_SDK_PATH=$HOME/Downloads/PlaydateSDK
export PATH=$PATH:$PLAYDATE_SDK_PATH/bin

# Compile and execute on Linux

pdc source/ motochase

PlaydateSimulator motochase.pdx/
