self.addEventListener("message", async (event) => {
  console.log("Worker received url:", event.data);
  const res = await fetch(event.data);
  const blob = await res.blob();

  self.postMessage({
    url: event.data,
    blob,
  });
});
