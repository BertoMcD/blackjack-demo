const getRandomInt = (min:number, max:number ) => Math.floor(Math.random() * (max - min + 1)) + min;

class Deck {
	public cardTotal: number;
	public cards: number;
	public suits: any;
	public suitTypes: any;

	constructor(decks: number) {
		this.cardTotal = decks * 52;
		this.cards = this.cardTotal;
		this.suitTypes = ['hearts','clubs','diamonds','spades'];

		let suitBase = [];
		for (let d = 0; d < decks; d++) {
			for (var i = 1; i <= 13; i++) {
				suitBase.push(i);
			}
		}

		this.suits = {
			'hearts': suitBase,
			'clubs': suitBase,
			'diamonds': suitBase,
			'spades': suitBase
		}
	}

	public drawCard() {
		let fullSuits = this.suitTypes.length - 1,
			suit = this.suitTypes[getRandomInt(0, fullSuits)],
			suitLength = this.suits[suit].length,
			cardIndex = getRandomInt(0, suitLength - 1),
			card = this.suits[suit][cardIndex],
			output = {
				'number': card,
				'suit': suit
			};

		this.cards--;
		this.suits[suit].splice(cardIndex, 1);
		if (this.suits[suit].length == 0) {
			console.log(`${suit} empty`);
			for (var i=this.suitTypes.length-1; i>=0; i--) {
				if (this.suitTypes[i] === suit) {
					console.log(this.suitTypes[i]);
					this.suitTypes.splice(i, 1);
				}
			}
		}

		return output;
	}
}

class Player {
	private hand: any;
	public playerId: number;
	protected handTotal: number;
	protected altTotal: number;
	public inPlay: boolean;
	protected score: number;
	public plDisplay: any;
	public plLabel: any;
	public handRow: any;
	public hitBtn: any;
	public holdBtn: any;
	public scoreBoard: any;
	public cardTotal: number;

	constructor(id: number) {
		this.hand = [];
		this.playerId = id;
		this.handTotal = 0;
		this.altTotal = 0;
		this.score = 0;
		this.inPlay = true;
		this.cardTotal = 0;
		this.addPlayer();
	}

	public addPlayer() {
		let playerRow = <HTMLElement> document.querySelector('.js-players');
		playerRow.innerHTML = "";
		this.plDisplay = document.createElement('div');
		this.plLabel = document.createElement('h2');
		this.handRow = document.createElement('div');
		this.hitBtn = document.createElement('button');
		this.holdBtn = document.createElement('button');
		this.scoreBoard = document.createElement('span');

		this.plDisplay.setAttribute('class', 'player-display js-player');

		this.plLabel.innerText = `Player `;
		this.plLabel.setAttribute('class', 'label');
		this.handRow.setAttribute('class', 'player-hand js-player-hand');
		this.handRow.setAttribute('id', `player-${this.playerId}`);
		this.handRow.setAttribute('data-player', `${this.playerId}`);

		this.hitBtn.setAttribute('class', 'button hit js-hit');
		this.hitBtn.setAttribute('data-player', `${this.playerId}`);
		this.hitBtn.innerText = 'Hit';

		this.holdBtn.setAttribute('class', 'button hold js-hold');
		this.holdBtn.setAttribute('data-player', `${this.playerId}`);
		this.holdBtn.innerText = 'Hold';

		this.scoreBoard.setAttribute('class', 'js-score');
		this.scoreBoard.setAttribute('id', `pl-score-${this.playerId}`);
		this.scoreBoard.textContent = this.score.toString();

		this.plLabel.appendChild(this.scoreBoard);

		this.plDisplay.appendChild(this.plLabel);
		this.plDisplay.appendChild(this.handRow);
		this.plDisplay.appendChild(this.hitBtn);
		this.plDisplay.appendChild(this.holdBtn);

		playerRow.appendChild(this.plDisplay);
	}

	public addCard(card) {
		this.hand.push(card);
		this.cardTotal++;

		if (card['number'] == 1) {
			this.handTotal++;
			this.altTotal += 11;
		} else if (card['number'] >= 10) {
			this.handTotal += 10;
			this.altTotal += 10;
		} else if (card['number'] > 1 || card['number'] < 11) {
			this.handTotal += card['number'];
			this.altTotal += card['number'];
		}

		this.displayCard(card);
	}

	public displayCard(card) {
		let hand = <HTMLElement> this.plDisplay.querySelector('#player-' + this.playerId),
			faceCards = {
				1: 'A',
				11: 'J',
				12: 'Q',
				13: 'K'
			},
			faceKey = card['number'],
			imgKey = card['number'] < 2 || card['number'] > 10 ? faceCards[faceKey] : card['number'];
		hand.innerHTML += `
			<div class="card">
				<img src="img/${imgKey}-${card['suit']}.svg" alt="${imgKey} ${card['suit']}">
			</div>
		`;
	}

	public clearHand() {
		let hand = <HTMLElement> this.plDisplay.querySelector('#player-' + this.playerId);
		hand.innerHTML = '';
		this.hand = [];
		this.handTotal = 0;
		this.altTotal = 0;
	}

	public getHandTotal() {
		if (this.handTotal > 21 && this.altTotal > 21) {
			return this.handTotal
		} else if (this.handTotal <= 21 && this.altTotal <= 21) {
			if (this.handTotal == 21 || this.altTotal == 21) {
				return 21;
			} else {
				return this.handTotal > this.altTotal ? this.handTotal : this.altTotal;
			}
		} else if (this.handTotal > 21 || this.altTotal > 21) {
			return this.handTotal < this.altTotal ? this.handTotal : this.altTotal;
		}
	}

	public hideUi() {
		this.hitBtn.className += ' _hidden';
		this.holdBtn.className += ' _hidden';
	}

	public showUi() {
		this.hitBtn.classList.remove('_hidden');
		this.holdBtn.classList.remove('_hidden');
	}

	public win(double: boolean) {
		this.score += double ? 2 : 1;
		this.scoreBoard.textContent = this.score.toString();
	}
}

class Dealer extends Player {
	addPlayer() {
		let playerRow = <HTMLElement> document.querySelector('.js-dealer');
		playerRow.innerHTML = "";
		this.plDisplay = document.createElement('div');
		this.plLabel = document.createElement('h2');
		this.handRow = document.createElement('div');
		this.scoreBoard = document.createElement('span');

		this.plDisplay.setAttribute('class', 'player-display js-player');

		this.plLabel.innerText = `Player `;
		this.plLabel.setAttribute('class', 'label');
		this.handRow.setAttribute('class', 'player-hand js-player-hand -dealer');
		this.handRow.setAttribute('id', `player-${this.playerId}`);
		this.handRow.setAttribute('data-player', `${this.playerId}`);

		this.scoreBoard.setAttribute('class', 'js-score');
		this.scoreBoard.setAttribute('id', `pl-score-${this.playerId}`);
		this.scoreBoard.textContent = this.score.toString();

		this.plLabel.appendChild(this.scoreBoard);

		this.plDisplay.appendChild(this.plLabel);
		this.plDisplay.appendChild(this.handRow);

		playerRow.appendChild(this.plDisplay);
	}
}

class Game {
	private deck: Deck;
	public deckCount: number;
	public players: any;
	public resetBtn: any;

	constructor(playerCount: number = 1, decks:number = 1) {
		this.deckCount = decks;
		this.deck = new Deck(this.deckCount);
		this.players = new Array(++playerCount);
		this.assignPlayers(playerCount);
		this.resetBtn = document.querySelector('.js-reset');
		this.resetBtn.addEventListener('click', this.newHand);
	}

	private shuffle() {
		this.deck = new Deck(this.deckCount);
	}

	private assignPlayers(playerCount) {
		this.players[0] = new Dealer(0);
		for (let i = 1; i < playerCount; i++) {
			this.players[i] = new Player(i);
			this.players[i].hitBtn.addEventListener("click", this.hit);
			this.players[i].holdBtn.addEventListener("click", this.hold);
		}
	}

	public dealCards() {
		for (var i = 0; i < 2; i++) {
			for (let i = 0; i < this.players.length; i++) {
				this.players[i].addCard(this.deck.drawCard());
			}
		}
		this.evaluateScore('initial');
	}

	private evaluateScore(action: string) {
		// for (let i = 1; i < this.players.length; ++i) {
			let playerHand = this.players[1].getHandTotal(),
				dealerHand = this.players[0].getHandTotal();

			if (action == 'initial') {
				if (playerHand == 21 && dealerHand != 21) {
					this.players[1].win(true);
					this.players[1].hideUi();
					this.endGame();
				}
			}
			if (action == 'hit') {
				if (playerHand > 21) {
					this.players[0].win(this.players[0].cardTotal == 2);
					this.players[1].hideUi();
					this.endGame();
				}
			}
			if (action == 'hold') {
				if ((playerHand == 21 && dealerHand != 21) || (playerHand < 21 && dealerHand > 21)) {
					this.players[1].win();
				} else if (playerHand < 21 && dealerHand < 21) {
					if (playerHand == dealerHand) {
						this.players[0].win(this.players[0].cardTotal == 2);
					} else if (playerHand > dealerHand) {
						this.players[1].win();
					} else {
						this.players[0].win(this.players[0].cardTotal == 2);
					}
				}
				this.players[1].hideUi();
				this.endGame();
			}
		// }
	}

	public endGame() {
		this.resetBtn.classList.remove('_hidden');
	}

	public startGame() {
		this.resetBtn.className += ' _hidden';
	}

	public newHand = () => {
		this.shuffle();
		this.players[0].clearHand();
		this.players[1].clearHand();
		this.players[1].showUi();
		this.dealCards();
	}

	private hit = (e) => {
		if (this.deck.cards > 0) {
			let id = parseInt(e.target.dataset.player);
			this.players[id].addCard(this.deck.drawCard());

			let dealerTotal = this.players[0].getHandTotal();
			if (dealerTotal < 17) {
				this.players[0].addCard(this.deck.drawCard());
			}
			this.evaluateScore('hit');
		}
	}

	private hold = (e) => {
		let id = parseInt(e.target.dataset.player),
			dealerTotal = this.players[0].getHandTotal();

		if (dealerTotal < 17) {
			do {
				this.players[0].addCard(this.deck.drawCard());
				dealerTotal = this.players[0].getHandTotal();
			} while (dealerTotal < 17);
		}
		this.evaluateScore('hold');
	}
}

var game = new Game();
game.dealCards();
