import { Form } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { redirect } from "react-router-dom";
import { useNavigation } from "react-router-dom";
import { useActionData } from "react-router-dom";
import Button from "../../ui/Button";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData();

  return (
    <div>
      <h2>Ready to order? Let&apos;s go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      {/* action is not required, request will be sent to nearest route */}
      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" className="input" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" className="input" required />
          </div>
          {formErrors?.phone && <p>{formErrors.phone}</p>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" className="input" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Placing order..." : "Order now"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // convert the data to what we want
  const orderData = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };

  const errors = {};

  if (!isValidPhone(orderData.phone)) {
    errors.phone =
      "Please provide correct phone number. We might need it to contact you";
  }

  // check we have any error
  // we can get this error value in the createOrder component using hook
  if (Object.keys(errors).length > 0) return errors;

  const newOrderData = await createOrder(orderData);
  // console.log()
  // redirect to order/:id page
  return redirect(`/order/${newOrderData.id}`);
}

export default CreateOrder;
