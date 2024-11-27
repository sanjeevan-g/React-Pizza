import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

function UpdateOrder() {
  const fetcher = useFetcher();

  /*
    using fetcher, we can submit form also
    difference between Form and fetcher.Form is fetcher form won't reload the page
    it will perform partial reload
   */
  return (
    <fetcher.Form method="patch" className="text-right">
      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  );
}

// like normal Form action create action function

async function action({ params }) {
  //   we are using patch request, so we don't need the whole order property
  const data = { priority: true };

  await updateOrder(params.orderId, data);
  return null;
}

UpdateOrder.action = action;

export default UpdateOrder;
