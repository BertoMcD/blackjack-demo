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
	public playerRow: any;
	protected handTotal: number;
	protected altTotal: number;
	public status: string;

	constructor(id: number) {
		this.hand = [];
		this.playerId = id;
		this.handTotal = 0;
		this.altTotal = 0;
		this.status = 'in-play';
		this.addPlayer();
	}

	public addPlayer() {
		this.playerRow = <HTMLElement> document.querySelector('.js-players');
		this.playerRow.innerHTML = "";
		let player = document.createElement('div'),
			label = document.createElement('h2'),
			hand = document.createElement('div'),
			hit = document.createElement('button'),
			stay = document.createElement('button');

		player.setAttribute('class', 'player-display js-player');

		label.innerText = `Player ${this.playerId}`;
		label.setAttribute('class', 'label');
		hand.setAttribute('class', 'player-hand js-player-hand');
		hand.setAttribute('id', `player-${this.playerId}`);
		hand.setAttribute('data-player', `${this.playerId}`);

		hit.setAttribute('class', 'button hit js-hit');
		hit.setAttribute('data-player', `${this.playerId}`);
		hit.innerText = 'Hit';

		stay.setAttribute('class', 'button stay js-stay');
		stay.setAttribute('data-player', `${this.playerId}`);
		stay.innerText = 'Stay';

		player.appendChild(label);
		player.appendChild(hand);
		player.appendChild(hit);
		player.appendChild(stay);

		this.playerRow.append(player);
	}

	public addCard(card) {
		this.hand.push(card);

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
		let hand = <HTMLElement> this.playerRow.querySelector('#player-' + this.playerId),
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

	public getTotal() {
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
}

class Dealer extends Player {
	addPlayer() {
		this.playerRow = <HTMLElement> document.querySelector('.js-dealer');
		this.playerRow.innerHTML = "";
		let player = document.createElement('div'),
			label = document.createElement('h2'),
			hand = document.createElement('div');

		player.setAttribute('class', 'player-display js-player');

		label.innerText = `Dealer`;
		label.setAttribute('class', 'label');
		hand.setAttribute('class', 'player-hand js-player-hand -dealer');
		hand.setAttribute('id', `player-${this.playerId}`);
		hand.setAttribute('data-player', `${this.playerId}`);

		player.appendChild(label);
		player.appendChild(hand);

		this.playerRow.append(player);
	}
}

class Game {
	private deck: Deck;
	public players: any;
	public winner: any;

	constructor(playerCount: number = 1, decks:number = 2) {
		this.deck = new Deck(decks);
		this.players = new Array(++playerCount);
		this.assignPlayers(playerCount);
	}

	private assignPlayers(playerCount) {
		this.players[0] = new Dealer(0);
		for (let i = 1; i < playerCount; i++) {
			this.players[i] = new Player(i);
			let hitBtn = this.players[i].playerRow.querySelector('.js-hit');
			hitBtn.addEventListener("click", this.hit);
			let stayBtn = this.players[i].playerRow.querySelector('.js-stay');
			stayBtn.addEventListener("click", this.stay);
		}
	}

	public dealCards() {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].addCard(this.deck.drawCard());
		}
	}

	private evaluateScore(action: string = 'hit') {
		for (let i = 1; i < this.players.length; ++i) {
			let score = this.players[i].getTotal(),
				dealerScr = this.players[0].getTotal();

			if (action == 'stay' && dealerScr == 21 && score <= 21) {
				this.winner = this.players[0];
				this.endGame();
			} else if (action == 'stay' && dealerScr > 21 && score <= 21) {
				this.winner = this.players[i];
				this.endGame();
			} else {
				if (score == 21) {
					this.winner = this.players[i];
					this.endGame(dealerScr == 21);
				} else if (score > 21) {
					this.winner = this.players[0];
					this.endGame(dealerScr > 21);
				} else if (score < 21 && action == 'stay') {
					if (score == dealerScr) {
						this.endGame(true);
					} else if (score > dealerScr && dealerScr < 21) {
						this.winner = this.players[i];
						this.endGame();
					} else if (score < dealerScr && dealerScr < 21) {
						this.winner = this.players[0];
						this.endGame();
					}
				}
			}
		}
	}

	private endGame(draw: boolean = false) {
		let message = '';
		if (draw) {
			message = "Push";
		} else {
			message = this.winner.playerId == 0 ? "Dealer Wins" : `Player ${this.winner.playerId}`;
		}
		for (let i = 1; i < this.players.length; i++) {
			let player = this.players[i].playerRow;
			player.querySelector('.js-hit').className += ' _hidden';
			player.querySelector('.js-stay').className += ' _hidden';
		}
		document.querySelector('.js-result').textContent = message;
		if (this.winner.playerId > 0 && !draw) {
			this.players[0].playerRow.querySelector('.js-player-hand').className += ' -reveal'
		}
	}

	private hit = (e) => {
		if (this.deck.cards > 0) {
			let id = parseInt(e.target.dataset.player);
			this.players[id].addCard(this.deck.drawCard());

			let dealerTotal = this.players[0].getTotal();
			if (dealerTotal <= 16) {
				this.players[0].addCard(this.deck.drawCard());
			}
			this.evaluateScore();
		}
	}

	private stay = (e) => {
		let id = parseInt(e.target.dataset.player),
			dealerTotal = this.players[0].getTotal();

		if (dealerTotal <= 16) {
			do {
				this.players[0].addCard(this.deck.drawCard());
				dealerTotal = this.players[0].getTotal();
			} while (dealerTotal <= 16);
		}
		this.evaluateScore('stay');
	}
}

var game = new Game(1, 6);
game.dealCards();

function reset() {
	game = new Game(1, 6);
	game.dealCards();
	document.querySelector('.js-result').textContent = '';
}

document.querySelector('.js-reset').addEventListener('click', reset);
