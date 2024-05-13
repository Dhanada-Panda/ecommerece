const cart = [];

const HandleCart = (state = cart, action) => {
  switch (action.type) {
    case "ADDITEM":
      const { product } = action.payload; // Destructure the product from action.payload
      const exist = state.find((x) => x.product && x.product.id === product.id);
 // Access product.id instead of Product.id
      if (exist) {
        return state.map((x) =>
          x.product.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        return [
          ...state,
          {
            product,
            qty: 1,
          },
        ];
      }
      
    case "DELITEM":
      const exist1 = state.find((x) => x.product.id === action.payload.id); // Access product.id from action.payload
      if (exist1.qty === 1) {
        return state.filter((x) => x.product.id !== exist1.product.id); // Filter based on product.id
      } else {
        return state.map((x) =>
          x.product.id === action.payload.id
            ? { ...x, qty: x.qty - 1 }
            : x
        );
      }
      
    default:
      return state;
  }
};

export default HandleCart;
