const function_map = {

    toggleLArm: function() {
        var x = document.getElementById("ArmL");
        var y = document.getElementById("bigArmL");
        if (x.style.display === "none" && y.style.display === "none") {
            x.style.display = "block";
        } else if (x.style.display === "block" && y.style.display === "none") {
            x.style.display = "none";
        } else if (x.style.display === "none" && y.style.display === "block") {
            y.style.display = "none";
            x.style.display = "block";      
        } else {
            x.style.display = "none";
        }
    },
    toggleRArm: function() {
        var x = document.getElementById("ArmR");
        var y = document.getElementById("bigArmR");
        if (x.style.display === "none" && y.style.display === "none") {
            x.style.display = "block";
        } else if (x.style.display === "block" && y.style.display === "none") {
            x.style.display = "none";
        } else if (x.style.display === "none" && y.style.display === "block") {
            y.style.display = "none";
            x.style.display = "block";      
        } else {
            x.style.display = "none";
        }
    },
    togglebigArmL: function() {
        var x = document.getElementById("bigArmL");
        var y = document.getElementById("ArmL");
        if (x.style.display === "none" && y.style.display === "none") {
            x.style.display = "block";
        } else if (x.style.display === "block" && y.style.display === "none") {
            x.style.display = "none";
        } else if (x.style.display === "none" && y.style.display === "block") {
            y.style.display = "none";
            x.style.display = "block";      
        } else {
            x.style.display = "none";
        }
    },
    togglebigArmR: function() {
        var x = document.getElementById("bigArmR");
        var y = document.getElementById("ArmR");
        if (x.style.display === "none" && y.style.display === "none") {
            x.style.display = "block";
        } else if (x.style.display === "block" && y.style.display === "none") {
            x.style.display = "none";
        } else if (x.style.display === "none" && y.style.display === "block") {
            y.style.display = "none";
            x.style.display = "block";      
        } else {
            x.style.display = "none";
        }
    },
    toggleLeg1: function() {
        var x = document.getElementById("Leg1");
        var y = document.getElementById("Leg2");
        if (x.style.display === "none" && y.style.display === "none") {
            x.style.display = "block";
        } else if (x.style.display === "block" && y.style.display === "none") {
            x.style.display = "none";
        } else if (x.style.display === "none" && y.style.display === "block") {
            y.style.display = "none";
            x.style.display = "block";      
        } else {
            x.style.display = "none";
        }
    },
    toggleLeg2: function() {
        var x = document.getElementById("Leg2");
        var y = document.getElementById("Leg1");
        if (x.style.display === "none" && y.style.display === "none") {
            x.style.display = "block";
        } else if (x.style.display === "block" && y.style.display === "none") {
            x.style.display = "none";
        } else if (x.style.display === "none" && y.style.display === "block") {
            y.style.display = "none";
            x.style.display = "block";      
        } else {
            x.style.display = "none";
        }
    },
    togglehead: function () {
        var x = document.getElementById("head");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },
    toggleBackAL: function() {
        var x = document.getElementById("bAL");
        var y = document.getElementById("wingL");
        if (x.style.display === "none" && y.style.display === "none") {
            x.style.display = "block";
        } else if (x.style.display === "block" && y.style.display === "none") {
            x.style.display = "none";
        } else if (x.style.display === "none" && y.style.display === "block") {
            y.style.display = "none";
            x.style.display = "block";      
        } else {
            x.style.display = "none";
        }
    },
    toggleBackAR: function() {
        var x = document.getElementById("bAR");
        var y = document.getElementById("wingR");
        if (x.style.display === "none" && y.style.display === "none") {
            x.style.display = "block";
        } else if (x.style.display === "block" && y.style.display === "none") {
            x.style.display = "none";
        } else if (x.style.display === "none" && y.style.display === "block") {
            y.style.display = "none";
            x.style.display = "block";      
        } else {
            x.style.display = "none";
        }
    },
    togglewingL: function() {
        var x = document.getElementById("wingL");
        var y = document.getElementById("bAL");
        if (x.style.display === "none" && y.style.display === "none") {
            x.style.display = "block";
        } else if (x.style.display === "block" && y.style.display === "none") {
            x.style.display = "none";
        } else if (x.style.display === "none" && y.style.display === "block") {
            y.style.display = "none";
            x.style.display = "block";      
        } else {
            x.style.display = "none";
        }
    },
    togglewingR: function() {
        var x = document.getElementById("wingR");
        var y = document.getElementById("bAR");
        if (x.style.display === "none" && y.style.display === "none") {
            x.style.display = "block";
        } else if (x.style.display === "block" && y.style.display === "none") {
            x.style.display = "none";
        } else if (x.style.display === "none" && y.style.display === "block") {
            y.style.display = "none";
            x.style.display = "block";      
        } else {
            x.style.display = "none";
        }
    }

}


window.onload = function () {

    Object.keys(function_map).forEach(f => function_map[f]())

    const btns = document.querySelectorAll("button[data-func]")
    btns.forEach(btn => {
        const data_func = function_map[btn.dataset.func]
        if (data_func) {
            btn.addEventListener("click", data_func)
        }
    })
}