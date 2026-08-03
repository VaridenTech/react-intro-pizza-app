import { createLazyFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useFormStatus } from "react-dom"; // note react-dom, not react
import postContact from "../api/postContact";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

export function ContactRoute() {
  const mutation = useMutation({
    mutationFn: function (formData: FormData) {
      return postContact(
        String(formData.get("name")),
        String(formData.get("email")),
        String(formData.get("message")),
      );
    },
  });

  return (
    <div className="contact">
      <h2>Contact</h2>
      {mutation.isSuccess ? (
        <h3>Submitted!</h3>
      ) : (
        <form action={mutation.mutate}>
          <ContactInput name="name" type="text" placeholder="Name" />
          <ContactInput name="email" type="email" placeholder="Email" />
          <textarea placeholder="Message" name="message"></textarea>
          <button>Submit</button>
        </form>
      )}
    </div>
  );
}

type ContactInputProps = {
  name: string;
  // union ของค่า type ที่ <input> รับได้จริง จับ typo อย่าง "emial" ได้
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
};

function ContactInput(props: ContactInputProps) {
  const { pending } = useFormStatus();
  return (
    <input
      disabled={pending}
      name={props.name}
      type={props.type}
      placeholder={props.placeholder}
    />
  );
}
