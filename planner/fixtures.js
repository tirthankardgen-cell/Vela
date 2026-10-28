// The flat templates use real fixture kinds so their sizes and placement stay
// editable through the same inspector, JSON and catalogue as other furniture.
export const fixtureTypes = {
  counter: {label: 'Kitchen base cabinet', w: 1.8, d: .6, h: .9, color: '#b7bca9', category: 'furniture', icon: 'M3 7H39V27H3ZM15 8V27M27 8V27M8 13H11M20 13H23M32 13H35'},
  sink: {label: 'Kitchen sink', w: .7, d: .48, h: .04, e: .91, color: '#cbd4d2', category: 'structure', icon: 'M3 6H39V27H3ZM9 10H33V23H9ZM20 10V3H27'},
  hob: {label: 'Cooktop', w: .6, d: .5, h: .04, e: .91, color: '#3e4541', category: 'electronics', icon: 'M4 3H38V29H4ZM10 10H17V17H10ZM25 10H32V17H25ZM10 21H17M25 21H32'},
  fridge: {label: 'Refrigerator', w: .7, d: .7, h: 1.8, color: '#c8ceca', category: 'electronics', icon: 'M10 2H32V30H10ZM10 12H32M15 6V9M15 17V23'},
  washer: {label: 'Washing machine', w: .6, d: .65, h: .85, color: '#e0e3dd', category: 'electronics', icon: 'M7 3H35V29H7ZM7 9H35M12 6H18M28 6H31M21 13A6 6 0 1 0 21 25A6 6 0 1 0 21 13'},
  toilet: {label: 'WC', w: .4, d: .7, h: .75, color: '#f2f3ed', category: 'structure', icon: 'M12 3H30V10H12ZM13 11H29Q34 26 21 29Q8 26 13 11Z'},
  basin: {label: 'Washbasin', w: .5, d: .45, h: .82, color: '#f0f1eb', category: 'structure', icon: 'M5 8H37V28H5ZM10 12H32Q34 23 21 24Q8 23 10 12ZM21 12V3H28'},
  shower: {label: 'Shower enclosure', w: .9, d: .9, h: 2.1, color: '#b8cfcd', category: 'structure', icon: 'M7 3H35V29H7ZM7 23H35M16 3V9H25M19 12V16M25 12V16M21 25H25'},
};
