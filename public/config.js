let token, userId;

const twitch = window.Twitch.ext;

document.getElementById("saveConfig").addEventListener("click", saveConfig);
function saveConfig() {
  console.log("Hello World")
  let config
  try {
    config = document.querySelector('input[name="setting"]:checked').value  
  } catch (error) {
    config = 'Off'
  }
  twitch.configuration.set('Global', '0.0.1', config)
  twitch.configuration.set('Broadcaster', '0.0.1', config)
  twitch.configuration.set('Developer', '0.0.1', config)
  console.log(config)
  console.log("Global Config:", twitch.configuration.global)
  console.log("dev Config:", twitch.configuration.developer)
  console.log("broad Config:", twitch.configuration.broadcaster)
  twitch.rig.log("Global Config:", twitch.configuration.global)
  twitch.rig.log("dev Config:", twitch.configuration.developer)
  twitch.rig.log("broad Config:", twitch.configuration.broadcaster)
}
twitch.configuration.onChanged(()=>{
  console.log("Global Config:", twitch.configuration.global)
  console.log("dev Config:", twitch.configuration.developer)
  console.log("broad Config:", twitch.configuration.broadcaster)
  twitch.rig.log("Global Config:", twitch.configuration.global)
  twitch.rig.log("dev Config:", twitch.configuration.developer)
  twitch.rig.log("broad Config:", twitch.configuration.broadcaster)
});
twitch.onContext((context) => {
  twitch.rig.log(context);
});

twitch.onAuthorized((auth) => {
  token = auth.token;
  userId = auth.userId;
});
