let prompt = document.querySelector("#prompt");
let container = document.querySelector(".container");
let btn = document.querySelector("#btn");
let chatContainer =document.querySelector(".chat-container");
let userMessage = null;

let Api_Url = "https://chatgpt-clone-backend-vc8f.onrender.com"

function createChatBox(html,className){
    let div = document.createElement("div")
    div.classList.add(className)
    div.innerHTML= html
    return div
}

async function getApiResponse(aiChatBox){

let textElement = aiChatBox.querySelector(".text");

    try{
        let response= await fetch(Api_Url,{
            method:"POST",
            headers: { "Content-Type" : "application/json" },
            body:JSON.stringify({
                contents: [
                    {
                        "role":"user",
                        "parts": [{text: userMessage}]
                    }
                ]
            })
        })
        let data = await response.json();
        let ApiResponse = data?.candidates[0].content.parts[0].text;
        textElement.innerText = ApiResponse;

    }
    catch(error){
        console.log(error)

    }
    finally{
        aiChatBox.querySelector(".loading").style.display ="none"
    }
}

function showLoding(){
    let html = `<div class="img">
                    <img src="ai.png" alt="ai" width="50">
                </div>
                <p class="text"></p>
                <img class="loading" src="loading.gif" alt="loading" height="50">`;
                let aiChatBox = createChatBox(html, "ai-chat-box")
                chatContainer.appendChild(aiChatBox)
                getApiResponse(aiChatBox)
}

btn.addEventListener("click", () => {
    if (userMessage==" "){
        container.style.display= "flex"
    }else{
        container.style.display = "none" 
    }
    userMessage = prompt.value;
    if(!userMessage.trim()) return;
    let html =`<div class="img">
                <img src="user.png" alt="user" width="50">
            </div>
            <p class="text"></p>`;
    let userChatBox = createChatBox(html,"user-chat-box")
    userChatBox.querySelector(".text").innerText = userMessage
    chatContainer.appendChild(userChatBox)
    prompt.value =" "
    setTimeout(showLoding,500)
});

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btn.click();

});
