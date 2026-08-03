import { createLazyFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import postContact from "../api/postContact";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function ContactRoute() {
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
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            // ต้องอ่าน FormData ตรงนี้เลย เพราะ React ล้าง currentTarget ทิ้ง
            // ทันทีที่ handler จบ ส่วน mutationFn ถูกเรียกทีหลังแบบ async
            // currentTarget คือ <form> เสมอ ส่วน target อาจเป็นปุ่มข้างในได้
            mutation.mutate(new FormData(e.currentTarget));
          }}
        >
          <input name="name" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <textarea placeholder="Message" name="message"></textarea>
          <button>Submit</button>
        </form>
      )}
    </div>
  );
}
