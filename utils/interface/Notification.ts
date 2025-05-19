export default interface Notification {
  message: {
    key: string
    values?: Record<string, string>
  }
  link?: {
    url: string
    linkTextKey: string
  }
}
