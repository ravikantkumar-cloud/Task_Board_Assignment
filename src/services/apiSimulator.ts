export const simulateApi = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const fail = Math.random() < 0.1
      if (fail) {
        reject(new Error('Simulated network failure'))
      } else {
        resolve()
      }
    }, 2000)
  })
}
