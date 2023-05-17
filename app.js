/* eslint-disable import/extensions */
import Component from './core/Component.js';

export default class App extends Component {
  setup() {
    const data = {
      lists: [
        {
          listId: 0,
          listTitle: 'Task to Do',
          cards: [
            { cardId: 0, cardTitle: 'React', cardDesc: 'This is card desc 1' },
            { cardId: 1, cardTitle: 'TypeScript', cardDesc: 'This is card desc 2' },
          ],
          isOpen: false,
          isEditing: false,
        },
        {
          listId: 1,
          listTitle: 'Completed Tasks',
          cards: [
            { cardId: 10, cardTitle: 'HTML', cardDesc: 'This is card desc 1' },
            { cardId: 11, cardTitle: 'CSS', cardDesc: 'This is card desc 2' },
            { cardId: 12, cardTitle: 'JavaScript', cardDesc: 'This is card desc 3' },
          ],
          isOpen: false,
          isEditing: false,
        },
      ],
      isOpen: true,
      elementToFocus: { type: '', listId: '' },
    };
    localStorage.setItem('TRELLO_LISTS', JSON.stringify(data));
    const list = JSON.parse(localStorage.getItem('TRELLO_LISTS')) ?? [];

    this.state = list;
  }

  template() {
    // prettier-ignore
    return `
    <header class="header">
      <img src="./src/t-trello.png" class="logo" />
      <h1 class="title">Trello</h1>
    </header>
    <main class="main">
      
      <section class="lists">
      ${this.state.lists ? 
        this.state.lists.map(
          ({ listId, listTitle, cards, isOpen , isEditing}) =>
            `<section class="list" id=${listId}>
                ${isEditing ? `<textarea class="editing" rows=1>${listTitle}</textarea>` : `<div class="list-title">${listTitle}</div>`}
                <div class="cards">
            ${cards?.map(
                ({ cardTitle }) =>
                  `<div class="card">
                    <div class="card-title">${cardTitle}</div>
                  </div>`).join('')}
                </div>
                ${isOpen ? `
                  <form class="add-card-form">
                    <textarea class="textarea card-textarea" placeholder="Enter a title for this card.."></textarea>
                    <button class="add-card-button">Add Card</button>
                    <button type="button" class="close-button card-close">X</button>
                  </form>` 
                : `<p class="add-card">+ Add a card</p>`}
                
        </section>`).join('') : []}
      </section>
      ${this.state.isOpen ? 
        `<form class="add-list-form">
          <textarea class="textarea list-textarea" placeholder="Enter list title..."></textarea>
          <button class="add-list-button">Add List</button>
          <button type="button" class="close-button list-close">X</button>
        </form>` 
        :`<div class="add-more-list">+ Add another list</div>`}
    </main>
      `;
  }

  setEvent() {
    const toggleList = () => {
      const { isOpen } = this.state;
      this.setState({ ...this.state, isOpen: !isOpen, elementToFocus: { type: 'list' } });
    };

    const toggleCard = (target, isOpen) => {
      const { lists } = this.state;
      const { id } = target.closest('.list');

      this.setState({
        lists: lists.map(list => (list.listId === +id ? { ...list, isOpen } : list)),
        elementToFocus: { type: 'card', listId: id },
      });
    };

    const generateNewListId = () => Math.max(...this.state.lists.map(({ listId }) => listId), 0) + 1;

    const generateNewCardId = id => {
      const { cards } = this.state.lists.find(list => list.listId === +id);

      return Math.max(...cards.map(({ cardId }) => cardId), 0) + 1;
    };

    const addList = (e, $textarea) => {
      e.preventDefault();

      const listTitle = $textarea.value;
      if (listTitle.trim()) {
        $textarea.textContent = '';
        const newList = { listId: generateNewListId(), listTitle, cards: [] };
        this.setState({ lists: [...this.state.lists, newList], elementToFocus: { type: 'list' } });
      }
    };

    const addCard = (e, $textarea) => {
      e.preventDefault();
      const cardTitle = $textarea.value;

      if (cardTitle.trim()) {
        const { id } = e.target.closest('.list');

        const newCard = { cardId: generateNewCardId(+id), cardTitle, cardDesc: '' };

        this.setState({
          lists: this.state.lists.map(list =>
            list.listId === +id ? { ...list, cards: [...list.cards, newCard] } : list
          ),
          elementToFocus: { type: 'card', listId: id },
        });
      }
    };

    // 리스트 토글
    this.addEvent('click', '.add-more-list', toggleList);

    this.addEvent('click', '.close-button.list-close', toggleList);

    // 카드 토글
    this.addEvent('click', '.add-card', ({ target }) => {
      toggleCard(target, true);
    });

    this.addEvent('click', '.close-button.card-close', ({ target }) => {
      toggleCard(target, false);
    });

    this.addEvent('input', '.list-textarea', ({ target }) => {
      target.textContent = target.value;
    });

    // 리스트 추가
    this.addEvent('submit', '.add-list-form', e => {
      addList(e, e.target.querySelector('.list-textarea'));
    });

    this.addEvent('keydown', '.list-textarea', e => {
      if (e.key !== 'Enter') return;
      addList(e, e.target);
    });

    // 카드 추가
    this.addEvent('submit', '.add-card-form', e => {
      addCard(e, e.target.querySelector('.card-textarea'));
    });

    this.addEvent('keydown', '.card-textarea', e => {
      if (e.key === 'Enter') addCard(e, e.target);

      if (e.key === 'Escape') toggleCard(e.target, false);
    });

    this.addEvent('click', '.list-title', e => {
      const { id } = e.target.closest('.list');

      // 포커스 주기
      // const { listTitle } = this.state.lists.find(list => list.listId === +id);
      // const end = listTitle.length;
      // e.target.setSelectionRange(end, end);

      this.setState({
        lists: this.state.lists.map(list => (list.listId === +id ? { ...list, isEditing: true } : list)),
        elementToFocus: { type: 'editing', listId: id },
      });
    });

    this.addEvent('keydown', '.editing', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();

      const { id } = e.target.closest('.list');
      const edited = e.target.value;

      const { listTitle } = this.state.lists.find(list => list.listId === +id);

      this.setState({
        lists: this.state.lists.map(list =>
          list.listId === +id && edited !== listTitle
            ? { ...list, listTitle: edited, isEditing: false }
            : list.listId === +id && edited === listTitle
            ? { ...list, isEditing: false }
            : list
        ),
      });
    });
  }

  mounted() {
    if (!this.state.elementToFocus) return;
    const { type } = this.state.elementToFocus;

    if (type === 'card')
      this.$target.querySelector(`.list[id="${this.state.elementToFocus.listId}"] .card-textarea`)?.focus();
    if (type === 'list') this.$target.querySelector('.list-textarea')?.focus();
    if (type === 'editing') {
      const $editing = this.$target.querySelector(`.list[id="${this.state.elementToFocus.listId}"] > .editing`);
      if (!$editing) return;

      const end = $editing.value.length;
      $editing.setSelectionRange(end, end);
      $editing.focus();
    }
  }
}
