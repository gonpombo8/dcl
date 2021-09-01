export function statusLogic() {
  return {
    getStatus() {
      return { status: "ok", time: Date.now() };
    },
  };
}
