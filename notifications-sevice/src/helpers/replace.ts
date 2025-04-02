// pode receber duas tipagens, original e o que substitui
export type Replace<T, R> = Omit<T, keyof R> & R;
