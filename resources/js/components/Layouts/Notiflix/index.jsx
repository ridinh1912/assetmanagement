import Notiflix from 'notiflix';

export const BlockUI = (element, position) => {
  Notiflix.Block.arrows(element, 'Please wait ...', {
    messageColor: '#d6001c',
    fontFamily: 'Mulish',
    svgColor: '#d6001c',
    position: position ? position : 'absolute',
    zindex: position ? 1060 : 1000,
  });
};
