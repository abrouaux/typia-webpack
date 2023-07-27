import { checkIMember } from './models/test.typia';
// the app entry point. Nothing should be done / created / instantiated before that is called
async function startApp() {
    console.log("mark: startApp");
    // dynamic creation of the DOM structure - a "main" element, in which we have a video, and the nav stack as an overlay
    console.log(
      "valid:",
      checkIMember({
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "hello@gmail.com",
        age: 30,
      })
    );
}

window.onload = () => {
  void startApp();
};
