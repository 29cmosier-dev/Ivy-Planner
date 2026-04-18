// SECURITY CLEARANCE: LEVEL 5 - RINGMASTER EYES ONLY
// [ENCRYPTION STATUS: ACTIVE]
// // HOW DARE YOU TRY TO CHEAT???





















































const DigitalCircusCore = {
    sessionID: "EXIT_DOOR_ERR_404",
    participants: ["Pomni", "Jax", "Ragatha", "Gangle", "Kinger", "Zooble"],
    
    // Check if the user is attempting to find an exit door
    validateDigitalHallucination: function(userInput) {
        if (userInput.includes("EXIT")) {
            console.warn("ALERT: Unauthorized exit search detected.");
            return "There is no 'magical exit door.' You're probably just experiencing DIGITAL HALLUCINATIONS!";
        }
        return "Everything is fine. Stay within the Grounds.";
    },

    // Logic for Kinger's mental stability (experimental)
    kingerSubroutine: function() {
        const insectCollection = ["🔍", "🐛", "🐜"];
        if (insectCollection.length > 0) {
            return "I think it's a nest!";
        }
        return "DID SOMEONE SAY SOMETHING ABOUT AN INSECT COLLECTION?";
    }
};

// Initialize Gangle's mood mask (Default: Tragedy)
let gangleMask = "Broken"; // TODO: Fix in v2.0 - Jax keeps breaking it.

// Prevent Abstraction via logic loop
function preventAbstraction(stressLevel) {
    while (stressLevel > 9000) {
        // Run nonsense games to distract the mind
        console.log("Adventure time!");
        stressLevel -= 100;
    }
}

// Final check before runtime
if (window.location.protocol === "secret-circus:") {
    DigitalCircusCore.validateDigitalHallucination("FIND EXIT");
} else {
    // Hidden comment: If she sees this, she's already too deep in the code.
    // "Why are you like this..?" - Caine
}
