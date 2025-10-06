/* globals e, game */

console.log("Before anything, game =", window.game);
console.log("Does createCharacter exist?", typeof window.game?.createCharacter);


Object.assign(window.game, (function () {
    const playerSlot = document.getElementById('player');
    const enemySlot = document.getElementById('enemies');

    const player = game.createCharacter('player');
    const enemies = [
        game.createCharacter('rat'),
        game.createCharacter('skeleton'),
        game.createCharacter('rat'),
    ];

    const encounterController = game.encounterController(enemySlot, player);

    const controls = e('div', { id: 'controls' },
        e('button', { onClick: encounterController.onPlayerAttack }, 'Attack')
    );
    disableControls();

    playerSlot.appendChild(player.element);
    playerSlot.appendChild(controls);
    enemies.forEach(e => enemySlot.appendChild(e.element));

    game.events.onBeginTurn.subscribe(onBeginTurn);
    game.events.onEncounterEnd.subscribe((victory) => {
        if (victory) {
            alert('Enemies defeated!');
        } else {
            alert('You died!');
            disableControls();
        }
    });

    // Begin encounter as player
    encounterController.enter(enemies);

    function onBeginTurn(controller) {
        if (controller.character.ai) {
            console.log('AI controlled');
            disableControls();
            encounterController.onEnemyAttack();
            encounterController.selectTarget({ target: player.element });
        } else {
            console.log('Player turn');
            enableControls();
        }
    }

    function enableControls() {
        [...controls.children].forEach(c => c.disabled = false);
    }

    function disableControls() {
        [...controls.children].forEach(c => c.disabled = true);
    }
})());