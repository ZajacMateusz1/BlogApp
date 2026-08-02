export type WsMessageType<T> = {
  type: string;
  payload: T;
};
