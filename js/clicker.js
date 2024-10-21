/* Med document.queryselector(selector) kan vi hämta
 * de element som vi behöver från html dokumentet.
 * Vi spearar elementen i const variabler då vi inte kommer att
 * ändra dess värden.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 * Viktigt: queryselector ger oss ett html element eller flera om det finns.
 */
const clickerButton = document.querySelector('#game-button');
const moneyTracker = document.querySelector('#money');
const mpsTracker = document.querySelector('#mps'); // money per second
const mpcTracker = document.querySelector('#mpc'); // money per click
const upgradesTracker = document.querySelector('#upgrades');
const upgradeList = document.querySelector('#upgradelist');
const msgbox = document.querySelector('#msgbox');
const audioAchievement = document.querySelector('#swoosh');
const moneyBackground = document.querySelector("#money-background")
console.log(moneyBackground.src)

/* Följande variabler använder vi för att hålla reda på hur mycket pengar som
 * spelaren, har och tjänar.
 * last används för att hålla koll på tiden.
 * För dessa variabler kan vi inte använda const, eftersom vi tilldelar dem nya
 * värden, utan då använder vi let.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
 */
let money = 0;
let moneyPerClick = 1;
let moneyPerSecond = 0;
let acquiredUpgrades = 0;
let last = 0;
let numberOfClicks = 0; // hur många gånger har spelare eg. klickat
let active = false; // exempel för att visa att du kan lägga till klass för att indikera att spelare får valuta

// likt upgrades skapas här en array med objekt som innehåller olika former
// av achievements.
// requiredSOMETHING är vad som krävs för att få dem

let achievements = [

    {
        description: "Du är fattig",
        requiredMoney: 0,
        acquired: false,
        image: "https://magnoliatribune.com/wp-content/uploads/2024/02/259DF660-9886-41BA-8D91-B0731273AC9D.jpeg"
    },
    
    {
        description: "Du är lite mindre fattig",
        requiredMoney: 1000,
        acquired: false,
        image: "https://media.glamour.com/photos/5695e02f16d0dc3747ee7049/master/pass/inspired-2015-12-1960s-suburban-family-main.jpg"

    },
    
    {
        description: "Nu börjar det likna något",
        requiredMoney: 100000,
        acquired: false,
        image: "https://www.psychologs.com/wp-content/uploads/2023/08/The-Psychology-of-Rich-People.jpg"

    }

    // {
    //     description: 'Museet är redo att öppna, grattis! ',
    //     requiredUpgrades: 1,
    //     acquired: false,
    // },
    // {
    //     description: 'Nu börjar det likna något, fortsätt gräva!',
    //     requiredUpgrades: 10,
    //     acquired: false,
    // },
    // {
    //     description: 'Klickare, med licens att klicka!',
    //     requiredClicks: 10,
    //     acquired: false,
    // },
    // {
    //     description: 'Tac-2 god!',
    //     requiredClicks: 10000,
    //     acquired: false,
    // },
];

// // source: https://stackoverflow.com/a/11331200/4298200
// function Sound(source, volume, loop)
// {
//     this.source = source;
//     this.volume = volume;
//     this.loop = loop;
//     var son;
//     this.son = son;
//     this.finish = false;
//     this.stop = function()
//     {
//         document.body.removeChild(this.son);
//     }
//     this.start = function()
//     {
//         if (this.finish) return false;
//         this.son = document.createElement("embed");
//         this.son.setAttribute("src", this.source);
//         this.son.setAttribute("hidden", "true");
//         this.son.setAttribute("volume", this.volume);
//         this.son.setAttribute("autostart", "true");
//         this.son.setAttribute("loop", this.loop);
//         document.body.appendChild(this.son);
//     }
//     this.remove = function()
//     {
//         document.body.removeChild(this.son);
//         this.finish = true;
//     }
//     this.init = function(volume, loop)
//     {
//         this.finish = false;
//         this.volume = volume;
//         this.loop = loop;
//     }
// }

/* Med ett valt element, som knappen i detta fall så kan vi skapa listeners
 * med addEventListener så kan vi lyssna på ett specifikt event på ett html-element
 * som ett klick.
 * Detta kommer att driva klickerknappen i spelet.
 * Efter 'click' som är händelsen vi lyssnar på så anges en callback som kommer
 * att köras vi varje klick. I det här fallet så använder vi en anonym funktion.
 * Koden som körs innuti funktionen är att vi lägger till moneyPerClick till
 * money.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */


clickerButton.addEventListener(
    'click',
    () => {
        money += moneyPerClick;
            
        let audio = new Audio('audio/kachinf.mp3');  
        audio.play();
        audio.addEventListener('ended', () => {
            audio = null;  
        });
        // håll koll på hur många gånger spelaren klickat
        numberOfClicks += 1;
        // console.log(clicker.score);
    },
    false
);

/* För att driva klicker spelet så kommer vi att använda oss av en metod som heter
 * requestAnimationFrame.
 * requestAnimationFrame försöker uppdatera efter den refresh rate som användarens
 * maskin har, vanligtvis 60 gånger i sekunden.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 * funktionen step används som en callback i requestanaimationframe och det är
 * denna metod som uppdaterar webbsidans text och pengarna.
 * Sist i funktionen så kallar den på sig själv igen för att fortsätta uppdatera.
 */
function step(timestamp) {
    moneyTracker.textContent = Math.round(money);

    if (timestamp >= last + 1000) {
        money += moneyPerSecond;
        last = timestamp;
    }

  

    // achievements, utgår från arrayen achievements med objekt
    // koden nedan muterar (ändrar) arrayen och tar bort achievements
    // som spelaren klarat
    // villkoren i första ifsatsen ser till att achivments som är klarade
    // tas bort. Efter det så kontrolleras om spelaren har uppfyllt kriterierna
    // för att få den achievement som berörs.
    achievements = achievements.filter((achievement) => {
        if (achievement.acquired) {
            return false;
        }
        
        if (achievement.requiredMoney &&
            money >= achievement.requiredMoney
        ){
            achievement.acquired = true;
            moneyBackground.src = achievement.image
            message(achievement.description, 'achievement');

        }
        if (
            achievement.requiredUpgrades &&
            acquiredUpgrades >= achievement.requiredUpgrades
        ) {

            achievement.acquired = true;
            message(achievement.description, 'achievement');
            return false;
        } else if (
            achievement.requiredClicks &&
            numberOfClicks >= achievement.requiredClicks
        ) {
            
            achievement.acquired = true;
            message(achievement.description, 'achievement');
            return false;
        }
        return true;
    });

    window.requestAnimationFrame(step);
}

/* Här använder vi en listener igen. Den här gången så lyssnar iv efter window
 * objeket och när det har laddat färdigt webbsidan(omvandlat html till dom)
 * När detta har skett så skapar vi listan med upgrades, för detta använder vi
 * en forEach loop. För varje element i arrayen upgrades så körs metoden upgradeList
 * för att skapa korten. upgradeList returnerar ett kort som vi fäster på webbsidan
 * med appendChild.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 * Efter det så kallas requestAnimationFrame och spelet är igång.
 */
window.addEventListener('load', (event) => {
    upgrades.forEach((upgrade) => {
        upgradeList.appendChild(createCard(upgrade));
    });
    window.requestAnimationFrame(step);
});

/* En array med upgrades. Varje upgrade är ett objekt med egenskaperna name, cost
 * och amount. Önskar du ytterligare text eller en bild så går det utmärkt att
 * lägga till detta.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 */
upgrades = [
    {
        name: 'Startup Investment',
        cost: 10,
        amount: 1,
    },
    {
        name: 'Corporate Merger',
        cost: 50,
        clicks: 2, 
    },
    {
        name: 'Offshore Account',
        cost: 100,
        amount: 10,
        },
    {
        name: 'Real Estate Empire',
        cost: 500,
        amount: 50,
    },
    {
        name: 'Tech Monopoly',
        cost: 1000,
        amount: 100, 
    },
    {
        name: 'Lobbyist Network',
        cost: 2500,
        amount: 250, 
    },
    {
        name: 'Bank Bailout',
        cost: 5000,
        amount: 500, 
    },
    {
        name: 'Tax Haven',
        cost: 10000,
        amount: 1000, // Huge click boost
    },
    {
        name: 'Global Conglomerate',
        cost: 25000,
        amount: 2500, // Significantly increases money per click
    },
    {
        name: 'Private Island',
        cost: 50000,
        amount: 5000, // Massive boost per click
    },
    {
        name: 'World Domination',
        cost: 100000,
        amount: 10000, // Unparalleled money per click increase
    },
];


/* createCard är en funktion som tar ett upgrade objekt som parameter och skapar
 * ett html kort för det.
 * För att skapa nya html element så används document.createElement(), elementen
 * sparas i en variabel så att vi kan manipulera dem ytterligare.
 * Vi kan lägga till klasser med classList.add() och text till elementet med
 * textcontent = 'värde'.
 * Sedan skapas en listener för kortet och i den hittar vi logiken för att köpa
 * en uppgradering.
 * Funktionen innehåller en del strängar och konkatenering av dessa, det kan göras
 * med +, variabel + 'text'
 * Sist så fäster vi kortets innehåll i kortet och returnerar elementet.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
 */
function createCard(upgrade) {
    const card = document.createElement('div');
    card.classList.add('card');
    const header = document.createElement('p');
    header.classList.add('title');
    const cost = document.createElement('p');
    if (upgrade.amount) {
        header.textContent = `${upgrade.name}, +${upgrade.amount} per sekund.`;
    } else {
        header.textContent = `${upgrade.name}, +${upgrade.clicks} per klick.`;
    }
    cost.textContent = `Köp för ${upgrade.cost} benbitar.`;

    card.addEventListener('click', (e) => {
        if (money >= upgrade.cost) {
            acquiredUpgrades++;
            money -= upgrade.cost;
            upgrade.cost *= 1.5;
            cost.textContent = 'Köp för ' + upgrade.cost + ' benbitar';
            moneyPerSecond += upgrade.amount ? upgrade.amount : 0;
            moneyPerClick += upgrade.clicks ? upgrade.clicks : 0;
            message('Grattis du har köpt en uppgradering!', 'success');
        } else {
            message('Du har inte råd.', 'warning');
        }
    });

    card.appendChild(header);
    card.appendChild(cost);
    return card;
}

/* Message visar hur vi kan skapa ett html element och ta bort det.
 * appendChild används för att lägga till och removeChild för att ta bort.
 * Detta görs med en timer.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
 */
function message(text, type) {
    const p = document.createElement('p');
    p.classList.add(type);
    p.textContent = text;
    msgbox.appendChild(p);
    if (type === 'achievement') {
        audioAchievement.play();
    }
    setTimeout(() => {
        p.parentNode.removeChild(p);
    }, 2000);
}

const particleBox = document.querySelector("#particle-area");

function createParticle(parentElement = document.body) {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  const parentRect = parentElement.getBoundingClientRect();

  const randomX = Math.random() * (parentRect.width - 50); 
  const randomY = Math.random() * (parentRect.height - 50);

  particle.style.position = 'absolute';
  particle.style.left = `${randomX}px`;
  particle.style.top = `${randomY}px`;

  particle.innerHTML = `<h1>+${moneyPerClick}</h1>`;

  if (parentElement) {
    parentElement.appendChild(particle);
  }

  return particle;
}

clickerButton.addEventListener("click", function() {
  const particle = createParticle(particleBox);

  particle.addEventListener("animationend", function() {
    particle.remove();
  });
});

const gameButton = document.querySelector('#game-button');

gameButton.addEventListener('click', () => {
    gameButton.classList.add('bounce');

    setTimeout(() => {
        gameButton.classList.remove('bounce');
    }, 300); 
});
