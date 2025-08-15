let prompt = document.querySelector("#prompt");
let container = document.querySelector(".container");
let btn = document.querySelector("#btn");
let chatContainer = document.querySelector(".chat-container");
let userMessage = null;

let Api_Url = "https://chatgpt-clone-backend-iay2.onrender.com/api/chat";

function createChatBox(html, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

async function getApiResponse(aiChatBox) {
    let textElement = aiChatBox.querySelector(".text");

    try {
        let response = await fetch(Api_Url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        "role": "user",
                        "parts": [{ text: userMessage }]
                    }
                ]
            })
        });

        // If server sends error status (like 400), handle it
        if (!response.ok) {
            let errorText = await response.text();
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }

        let data = await response.json();

        // Safe access with optional chaining
        let ApiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from AI.";
        textElement.innerText = ApiResponse;

    } catch (error) {
        console.error("Error fetching AI response:", error);
        textElement.innerText = `⚠️ Error: ${error.message}`;
    } finally {
        aiChatBox.querySelector(".loading").style.display = "none";
    }
}

function showLoding() {
    let html = `
        <div class="img">
            <img src="ai.png" alt="ai" width="50">
        </div>
        <p class="text"></p>
        <img class="loading" src="loading.gif" alt="loading" height="50">
    `;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    getApiResponse(aiChatBox);
}

btn.addEventListener("click", () => {
    userMessage = prompt.value.trim();
    if (userMessage === "") {
        container.style.display = "flex";
        return;
    }
    container.style.display = "none";

    let html = `
        <div class="img">
            <img src="user.png" alt="user" width="50">
        </div>
        <p class="text"></p>
    `;
    let userChatBox = createChatBox(html, "user-chat-box");
    userChatBox.querySelector(".text").innerText = userMessage;
    chatContainer.appendChild(userChatBox);

    prompt.value = "";
    setTimeout(showLoding, 500);
});

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btn.click();
});
