export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  badge?: string;
  weight?: string;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
}

export const products: Product[] = [
  // ПИЦЦА
  {
    id: 1,
    name: "Пицца Ассорти",
    description: "Основа для пиццы, мясное ассорти, грибы, томатный соус, сыр моцарелла.",
    price: 750,
    image: "https://sun9-34.userapi.com/s/v1/ig2/ex1iMwk0BwBqv7hkRFakueWt1E0LSL9B0ptCugd7c2Om44o4cPz_6G1E2KEs7sLQhZXDPBzPFdHZSdIx6x3GJbzE.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2048x2048&from=bu&u=YESGjncFEidn4PmOE_p6EZ85PJ-KfMnOeK8HgsuUbVg&cs=540x0",
    category: "Пицца",
    badge: "Хит"
  },
  {
    id: 2,
    name: "Пицца S.A.D. FOOD",
    description: "Основа для пиццы, говяжье мясо, томат, перец болгарский, соус томатный, сыр моцарелла.",
    price: 780,
    image: "https://sun9-65.userapi.com/s/v1/ig2/FApASHJrG-2TIY1Fr70OqXumkXWwMmEUq62eyOJz8UFFAZK-0nrzJWLwsazs6NansvczobxBGixoQ1Z1mgwvdJBY.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=ZJXH9WxFUs3DE2Rulf4D6WMXHlPJSILeXFI93UMKZJQ&cs=540x0",
    category: "Пицца"
  },
  {
    id: 3,
    name: "Пицца Маргарита",
    description: "Основа для пиццы, томатный соус, охотничьи колбаски, ветчина, маринованный лук, сыр моцарелла, болгарский перец.",
    price: 680,
    image: "https://sun9-81.userapi.com/s/v1/ig2/JjxbbnFZYuSFrh3BiTKzZJQUGTL5CIz_-JAB-uYYrWFEZot_IeOsxMubuL2zqQdrPG7OpN-7AEzmp72em555RGYV.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=toP0TKq8CObZEB0YFfLbG_sKuZvkvNagfoI8jf2j6l4&cs=540x0",
    category: "Пицца"
  },
  {
    id: 4,
    name: "Пицца Милано",
    description: "Тесто, куриное мясо, грибы, кукуруза, соус томатный, сыр моцарелла.",
    price: 600,
    image: "https://sun9-78.userapi.com/s/v1/ig2/xQ9mDh8M_DuN2Nt7nAgeNUSr3BZXiOAN88B6zcgIa7UODgRDxGX5iqOlK9Ph0OaOEVa53kp0yDEWLgiQnHYZqixD.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2048x2048&from=bu&u=N7JEXDLfT1RJCYi-JCux3ApB1vqsmDCwNimakw0d4Qc&cs=540x0",
    category: "Пицца"
  },
  {
    id: 5,
    name: "Пицца Палермо",
    description: "Тесто, бекон, шампиньоны, соус томатный, сыр моцарелла, помидоры, базилик.",
    price: 630,
    image: "https://sun9-23.userapi.com/s/v1/ig2/spij5gNJmnC8lwlwlj2bUbHBfqVGwAqohP_fwANKo-ljTjRo9oNqBkmCUeeacPY884TnNvLDDUgsiHUo1w-mbduf.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=6FRA6zrscP7iimx4BpLdR3tVT8drQ9Mt_gQMkgrNff8&cs=540x0",
    category: "Пицца"
  },
  {
    id: 6,
    name: "Пицца Кальцоне",
    description: "Тесто, куриное филе, огурцы маринованные, соус-пицца, сыр моцарелла, шампиньоны, зелень, помидоры, кунжут.",
    price: 630,
    image: "https://sun9-9.userapi.com/s/v1/ig2/KSZ1RAxN9gZWZoIPgIEtjiHrRdqEE2VPcw0v25BEGX10rHNDVORwY-YK0L_caYcTCgKozYU_Osu6bSoBy_kuaI30.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=iNcWuqhjFXX9erSAKbKGdMLUPB3nfmpPaX1mZLA9aHM&cs=540x0",
    category: "Пицца"
  },
  {
    id: 7,
    name: "Пицца С грибами",
    description: "Основа для пиццы, соус томатный, сыр гауда, шампиньоны.",
    price: 600,
    image: "https://sun9-48.userapi.com/s/v1/ig2/NwY_58KeDX59iwk_rCVK4_vVN8vAXjy950AdUsGv1VK5PipAI9crv3cy80fO5k4bwF4jYqbIuu4uSbw5Z-RuA3SH.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=TVDPbyLVZlBaa3rOhuxQliB9eiPcotwkzCvkCu9w6g0&cs=540x0",
    category: "Пицца"
  },
  {
    id: 8,
    name: "Пицца Цезарь",
    description: "Основа для пиццы, куриная грудка-гриль, соус «Цезарь», салат айсберг, сыр моцарелла, сыр пармезан, помидоры черри.",
    price: 660,
    image: "https://sun9-67.userapi.com/s/v1/ig2/TUoMLAOhXIkUePffFeGrr2vVjkv5rcV9VspHit5B3aZUZ9JMKajQAjEorD9NE_8NBLNY9cA--yS-AIZnSYT3s-E6.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=gmVVQ-ed0ce6acBoKctW5F8yrifxiAXo7NYyHuFWG8U&cs=540x0",
    category: "Пицца"
  },
  {
    id: 9,
    name: "Пицца Сырное ассорти",
    description: "Основа для пиццы, соус томатный, сыр пармезан, сыр гауда, сыр моцарелла.",
    price: 650,
    image: "https://sun9-39.userapi.com/s/v1/ig2/oe7PtV6h8NUHPmt8ZPBEZqa9gGP7DTb_D7CR-4nOj3owIQitZMlxiz_5F6_EK9itnpJB5f0jdEGjRRo4_hRnZ_mJ.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=SeGN_CT6RvVf3o8agDfiGTggB0ozec-P5-pc8ALBWsQ&cs=540x0",
    category: "Пицца"
  },
  {
    id: 10,
    name: "Пицца Шумахер",
    description: "Основа для пиццы, соус томатный, куриное мясо, оливки, сыр моцарелла.",
    price: 650,
    image: "https://sun9-63.userapi.com/s/v1/ig2/KYj5XaXQu8MgfRHGdQ6EXLo-i1QxNkDpkbLMnAawlFO3arPk0LNUK1JQKrSN1i0Al3SzaiFFEJN3p9LiNbbF3g9R.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=5RuQi4PTC4feLBacy9dKg_Ly8vsHAfQz_KFq7yKbNXw&cs=540x0",
    category: "Пицца"
  },
  {
    id: 11,
    name: "Пицца Пепперони",
    description: "Основа для пиццы, соус томатный, колбаски пепперони, сыр моцарелла, шампиньоны.",
    price: 670,
    image: "https://sun9-20.userapi.com/s/v1/ig2/pw0y54aUHcgeGk1K4h6Cd14z-23o7otW2qHGfJNdqQHqbyDaLES9R1SQ23cMWZMV5iPwujYU9rv5R_qTY1BCRzRz.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=AbvG-_7tZybF5WelBEb5lwEgAq8Jy9jtfnqruTvcif4&cs=540x0",
    category: "Пицца",
    badge: "Акция"
  },

  // РУССКАЯ ПЕЧЬ
  {
    id: 12,
    name: "Томленная говядина с черносливом",
    description: "Томленная говядина с черносливом. За 1 порцию.",
    price: 350,
    image: "https://sun9-49.userapi.com/s/v1/ig2/Dm0I-0gRGxe4tRxapi7AJnpSn0saQVAfppcezftIq74PifYZcuBcDb40Z93OBqG3DhTLiMQrrHwkEmYMRduwloNf.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=ApPy201A6tPtvd15otD5fPBhlDhEY_P7B3PGUJN-azI&cs=540x0",
    category: "Русская печь",
    weight: "1 порция"
  },
  {
    id: 13,
    name: "Томленая говядина с овощами",
    description: "Томленая говядина с овощами. За 1 порцию.",
    price: 350,
    image: "https://sun9-28.userapi.com/s/v1/ig2/JpqTd235oPpWnxENNi0VyXBV6gwBi25ArgdTtHcT9NirUjSOgoYP-kGQ5zRrKiziE8NZqD9yJPrDYdDGOonF_wkQ.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=DU5im5kqFiV0-1z6LOY7b34q03nKHoEUfcpgG2QjdSo&cs=540x0",
    category: "Русская печь",
    weight: "1 порция"
  },
  {
    id: 14,
    name: "Пицца \"Хинкали\"",
    description: "Уникальное сочетание вкусов из русской печи.",
    price: 1220,
    image: "https://sun9-66.userapi.com/s/v1/ig2/C-Fx9cjVB3bElGEAYpeEvJPK5m9liy4ZftA8CzSCMJy12ITZxn5864qK8qyFo65GYfysh4651a5zgNkDI56Nda-p.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=osMOKuZBEdiojoLuXMEtevtCtkiUd_s-P7XoRTkobfU&cs=540x0",
    category: "Русская печь",
    badge: "Новинка"
  },

  // РОЛЛЫ
  {
    id: 15,
    name: "Роллы \"Нежный\"",
    description: "Лосось, нори, сыр, огурец, рис. 8 штук.",
    price: 380,
    image: "https://sun9-43.userapi.com/s/v1/ig2/MgbdeinRGoSEAsmwbs8wm5L1JYQ_CHzHNnJ4BFr3fOVRGBbaqCHEQGRlwmwEzW6e3cavJwJED9I66UDckUJ4CgMC.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=l8tRNZuuANGP_HceHzIaPW7fHzTZsnFmFKpAU3LjdZ8&cs=540x0",
    category: "Роллы",
    weight: "8 шт",
    badge: "Акция"
  },
  {
    id: 16,
    name: "Роллы \"Московский\"",
    description: "Креветка, сыр, нори, рис, огурец. 8 штук.",
    price: 480,
    image: "https://sun9-26.userapi.com/s/v1/ig2/wkcK8xw9AVcuKa8gNJIR3cuUrbTcxfb8A7wOMFiBQD9SiZ1Ju2vAhSnqOUilbsMs8C_T97Px2esBr3s6elJvQKy9.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=Q2zjwqXwFrRUblS8UjlEErUdpCVAX-tzrCv4xDqOJLY&cs=540x0",
    category: "Роллы",
    weight: "8 шт"
  },
  {
    id: 17,
    name: "Роллы \"Канада\"",
    description: "Угорь, сыр, нори, рис, огурец. 8 штук.",
    price: 480,
    image: "https://sun9-29.userapi.com/s/v1/ig2/cANRB4hmplB3fQ91bPb7LqPb2mCXCCP4yMejGwvdSY5R4REXW4Vecc47crWW7dGhC4XWcfQwQPAsQspbYmFEjTgt.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=AIcr53aLeiPr5ZZZIQH1lQe5L39zFZFPqXKzUQDBOhY&cs=540x0",
    category: "Роллы",
    weight: "8 шт"
  },
  {
    id: 18,
    name: "Роллы \"Филадельфия с тунцом\"",
    description: "Тунец, нори, сыр, огурец, рис. 8 штук.",
    price: 480,
    image: "https://sun9-68.userapi.com/s/v1/ig2/AKiWY_stxVhRbi0fwFnR3Y_mXhiTTDb1bXZ0-YSSj45vt5687qUMXV7ZFxhukzGQl86M5i7Xrpayix6yhLseozBO.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=JYsFmxZfkqCcvy_HFcQARuk9KXnbrmr8aZM4vy4bikg&cs=540x0",
    category: "Роллы",
    weight: "8 шт"
  },
  {
    id: 19,
    name: "Роллы \"Филадельфия с лососем\"",
    description: "Лосось, нори, сыр, огурец, рис. 8 штук.",
    price: 480,
    image: "https://sun9-65.userapi.com/s/v1/ig2/JTL7Upe6-AP-nbD5CQF9Li0DLIVQFortvat2QmsEPJffMYOj3X_s8qxirFiTrJvWwaN7vsqQ7gWmbGPAfO9-oRgW.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=QphUwWQlpZNBYNDUf8GSz1y56SmXREj5BZXqWHnQKKc&cs=540x0",
    category: "Роллы",
    weight: "8 шт",
    badge: "Хит"
  },

  // ВЫПЕЧКА
  {
    id: 20,
    name: "Хачапури слоёное с сыром",
    description: "За 1 штуку.",
    price: 120,
    image: "https://sun9-30.userapi.com/s/v1/ig2/j2HKPsaYva5j5Kp44hWRRiHH2tdYpwrdZTLtu_yETkIo62eSSFsbSSGCyj_CKpmjgJUqz4SMyUSBSllLSF0ULn6Q.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=BRT_RtQVwzZGigqr7M2fyciRO2NMt5BuWxDj1ez6MOs&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },
  {
    id: 21,
    name: "Хачапури \"По-аджарски\"",
    description: "За 1 штуку.",
    price: 350,
    image: "https://sun9-32.userapi.com/s/v1/ig2/ArUqDlfyGwMAwE9bvfrozXypKStLxBPkE8X33bZ7ked45kDYyEyK1WhuGM7TAAR_xW1070zyvXTvR7BREIdvFex3.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=P5AxsU5aPzVvLSyE_ttLkeu_T4AxzJzNic634UimNmw&cs=540x0",
    category: "Выпечка",
    weight: "1 шт",
    badge: "Хит"
  },
  {
    id: 22,
    name: "Хачапури \"По-мегрельски\"",
    description: "За 1 штуку.",
    price: 620,
    image: "https://sun9-10.userapi.com/s/v1/ig2/LlncJ8VLMPS3sqLed1FOh9B027GHA0M_hFqSQqiaDr0GOswiymANi-M5YOyxr3-dpMQlQbaqUO9Ab2nMj_YCeQrF.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=6qC3Ql-r1ypvBI_z1p9_k-a1w0u5cnFP43MFya4z190&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },
  {
    id: 23,
    name: "Хачапури \"По-имеретински\"",
    description: "За 1 штуку.",
    price: 620,
    image: "https://sun9-22.userapi.com/s/v1/ig2/4ebOhMZyjYn8w_ZVEyDTcLDtPlB0UT3EvohxGz0ePDg86dRxZtFG7F1LU6hkO1UHmZQQdvOE1FfiKnNIdsOxjLg3.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=YeYhaQCCCuqjgQmelGz_Z4cT5c7XbW5y2WOgXuBmliE&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },
  {
    id: 24,
    name: "Пирог с зеленью",
    description: "За 1 штуку.",
    price: 150,
    image: "https://sun9-68.userapi.com/s/v1/ig2/QLGx1DAjEZr-D06VwhDPc5xrpUEfS-i_VtRhGBWTKJGixkuiFnVPSG8U65dZt-G5REsFv2iXFaysXb_QEtka9Loi.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=d6P96QHr0GuNr_Z5cANsWvHUNhW1D8veykfiFPxAj_4&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },
  {
    id: 25,
    name: "Лепёшка",
    description: "За 1 штуку.",
    price: 80,
    image: "https://sun9-61.userapi.com/s/v1/ig2/mEcQwS09Rzm81IQjXSo4eeQRlkY9yO0455YvKCdfgjhxZSdL406SGsMX9Uhcnk8jb2TsjCe1_ej-HOAFI28wHBQh.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=E9zGy5jbQwhMuLtJF0c_RXHViDx7-z3aBFOLQhRmw5E&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },
  {
    id: 26,
    name: "Ламаджо с мясом",
    description: "За 1 штуку.",
    price: 120,
    image: "https://sun9-4.userapi.com/s/v1/ig2/LuuDBA3hplEDOHuUtLiaTtYdbtw65i2eOWMn4MZNunufykyA0Vn65RyfLp5wWxREvzwtP4W1EeAZBB7Ed5I53xjP.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=yTypfARum5TYo0gVJzVhg8qh_HcZJGicTTAgM1gtqLo&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },
  {
    id: 27,
    name: "Пирог с картошкой",
    description: "За 1 штуку.",
    price: 60,
    image: "https://sun9-36.userapi.com/s/v1/ig2/uNMZYwJV_zETGZEkTAEE2Ip8pEDFJmStn705y9rYgxZdcFsZD9e6TmrcooA29b4UgEQLQHC6tXej92CHnALXKPA6.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=H8nUPXkUWzEnVz9--l6_fhg5jjKkWztQngd1pllJ-hU&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },
  {
    id: 28,
    name: "Эчпочмак",
    description: "Курица, картофель, специи, тесто. За 1 штуку.",
    price: 100,
    image: "https://sun9-9.userapi.com/s/v1/ig2/uCWUvU8FBsF2R4f5YIQdsoWosnyKgmls09XS3RnROlnxmI4E59r0Q7TaDkZ8QwGM3FE9AvYZWUzF2yfSSU248Clh.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=cecJYSghgD_C3lbJNeMO4HMFQrmLMtYx5A3gEcI5qPU&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },
  {
    id: 29,
    name: "Самса с говядиной",
    description: "За 1 штуку.",
    price: 140,
    image: "https://sun9-78.userapi.com/s/v1/ig2/pVD_Z187xjcCqBnPZNMq7liuy-urXM5y7yI_d76m9ki2vIolovg_BxZpsG4qk5BXWCALbWEKO3Kz7VGt7lLEeOij.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=lf6X_hYuTtCfxQfJXl9q25d2lZ1WyNZNw8FMIUwHl6A&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },
  {
    id: 30,
    name: "Самса с фаршем",
    description: "За 1 штуку.",
    price: 120,
    image: "https://sun9-15.userapi.com/s/v1/ig2/BbEKs1TO6yUDNbMHhtWzAg9HyAaFJ5_qthX46MFKrbGfIjCkp20lAk45t_tpUQPfp4j0j7wshAqyMvtSG5j8v6TU.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=eg3Kuty-ZRk5zzqjBG-JQmYcryUYN8t8byM3m4vNhp0&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },
  {
    id: 31,
    name: "Сосиска в тесте",
    description: "За 1 штуку.",
    price: 70,
    image: "https://sun9-54.userapi.com/s/v1/ig2/fn-tghV_CHgsLymKNIuzIopmJFg1-fCJFdbO2-uh4LKJ7SXtmPwJcH5n1pVjGTQDJE_7SwTkog4Mbx0bHdzkK5Cn.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=mJHnz-u3aG9owg1QNCcOuI1Pqq2DcCppr1LBw3oVa8Q&cs=540x0",
    category: "Выпечка",
    weight: "1 шт"
  },

  // ГОРЯЧЕЕ
  {
    id: 32,
    name: "Шницель куриный",
    description: "За 1 штуку.",
    price: 100,
    image: "https://sun9-15.userapi.com/s/v1/ig2/-raIQIzO-P9aoBeqBZk-1TgL032hA1YKIrtgXAxJoDoSb47XlOvr61FcuAsSAzYklaq8n0btoVyDRp4RYq6_bWod.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=OW_fDHaJhRpvMg1lF8IC_pRvA6T8bsQc4QPbsXkWNPg&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 33,
    name: "Курица на гриле",
    description: "За 1 штуку.",
    price: 100,
    image: "https://sun9-9.userapi.com/s/v1/ig2/U9lKGiKWrt1F3r5Hav3LJ-CmP9ebeNALmYKEadR4nFgXewoQdZCLf9NrXVDtCcGVJH2GCaGkwdSuwHlXevMtbarg.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=u7IenbcvvwY5sCN4B5Cl0iQMI06lKWG5UetJXyKAWAc&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 34,
    name: "Котлета «Домашняя» говяжья",
    description: "За 1 штуку.",
    price: 100,
    image: "https://sun9-10.userapi.com/s/v1/ig2/cUVW6Qk71O3vfOvUpmDDdiTKvJwh_86S75cZkCuXYWkWVmKCQKScQgyiH4aEzSranzIsuGj8kkTANgZIVtFZ4vN8.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=5hjRqgRJ_fnasDZrQnjcT4VZrgblcnZT1Tl2-zV_ngQ&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 35,
    name: "Котлета «Домашняя» куриная",
    description: "За 1 штуку.",
    price: 90,
    image: "https://sun9-77.userapi.com/s/v1/ig2/29nMrBUHZBHDZjE_TqdUi3iqvb2h8_AnGJrMCOUbne8K4XLAXKYGh947GOzPkk_W2Le0ru5nnYfgQvJTTqXgJz6P.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=hKw4PKNrH_mA_HpEUvgLO9tgHzf_uVPC4dbaTBuTuKg&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 36,
    name: "Ролл с ветчиной и сыром",
    description: "За 1 штуку.",
    price: 130,
    image: "https://sun9-54.userapi.com/s/v1/ig2/i_yxkqOWXv52lr6KQtn_7tPxgv_ecgDRq_EP4XTvW-28-rMRC-FyTN9NHRf0ZKV4fe8jHzIdXqq1Dp5CJZmHhIIO.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=e6Ug1BisFw1c7IiSDe4Vb8oirI_skeAocJlZB8OCu9I&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 37,
    name: "Котлета «По-киевски»",
    description: "За 1 штуку.",
    price: 180,
    image: "https://sun9-26.userapi.com/s/v1/ig2/_EwmvwymOFfQunPJuUAFJSkOa4zDEFaNnIgv6rd0uVESBpuMHOxxwyiwdnMibPLvue93izbYeEQyt9Sx4rX-68zg.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=aTkg4kBme4bXE2bs_FBFDpzUhiVK_-a9s2yDf4tcSdY&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 38,
    name: "Мясо по-французски",
    description: "За 1 штуку.",
    price: 250,
    image: "https://sun9-49.userapi.com/s/v1/ig2/A8_Sp3LljlcDNpHJZFYKFuPunk2wy5nGLBDR7SuDXMZYKhSWiW2obdOG4i88rVQX6Q8qgZTUltOVJJBUTzxyxABU.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=bTtTH04HZ0xow7PwtrPiW3ghb9aAmCUctSczAGdayiQ&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 39,
    name: "Тефтели",
    description: "За 1 порцию (2 штуки).",
    price: 100,
    image: "https://sun9-32.userapi.com/s/v1/ig2/1aQwkAFR8-rSY7ShGZT4JJmaWcgsoZ_h182zhKDPssFd3Dks98s3piAG7z3fca5ReNVMXddGL1_rtR8_CFdTydE4.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,505x505&from=bu&u=EjIrZyjaP9XCq7LsVkrFHbXO2Ul61DtI1PjhoGrLgk4&cs=505x0",
    category: "Горячее",
    weight: "2 шт"
  },
  {
    id: 40,
    name: "Рагу “S.A.D. FOOD”",
    description: "Куриное филе, перец болгарский, брокколи, морковь, пекинская капуста, специи. За 100 гр.",
    price: 120,
    image: "https://sun9-63.userapi.com/s/v1/ig2/PoQxGCW6wAr5mc7IXf9JLmQXlncEczbT-UmgtyqcSHhZAu8nmZ2He2D3zCN2nPQYo3P7C9C28u5V4UyiP0L-nZ8q.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,993x993&from=bu&u=VOdzkqVuqKJxYYpyrxZmeh1W8B8mABTh_G0QG6zU8tU&cs=540x0",
    category: "Горячее",
    weight: "100 гр"
  },
  {
    id: 41,
    name: "Гуляш из говядины",
    description: "Говядина, болгарский перец, морковь, томатная паста, специи. За 100 гр.",
    price: 120,
    image: "https://sun9-59.userapi.com/s/v1/ig2/nSG0yDoFA0CjP14iK0PKLTnARE-Ii2d4Kp5CztsUJ3K4jzCbAb2BPTY7h9Ss5sV4G73B1xdsyhgOp-5Z9hZ7Xeuh.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2048x2048&from=bu&u=kfjfAYR9ZekY54aA1pqAcjVaALfa5exv5R2nGCRqV6c&cs=540x0",
    category: "Горячее",
    weight: "100 гр"
  },
  {
    id: 42,
    name: "Сливочная подлива с курицей и грибами",
    description: "Куриное филе, грибы, сметана, майонез, горчица, специи. За 100 гр.",
    price: 110,
    image: "https://sun9-59.userapi.com/s/v1/ig2/IhIPQC-fTkNK7O69DzdTOBp75FugWjkQZa3V7QMqcv5j28TVWm263QF0hMU8jR3yR8D5V-f1-JlKa3xpgkktQUnA.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&from=bu&u=bZxQS7rJOoj7hiMwAZf3lC2qxTHRyhFEySv2TWUWGwI&cs=540x0",
    category: "Горячее",
    weight: "100 гр"
  },
  {
    id: 43,
    name: "Овощи на гриле",
    description: "За 100 гр.",
    price: 80,
    image: "https://sun9-15.userapi.com/s/v1/ig2/M-_ql3KNk0aoUjZ5JJqSjt4HDejcC3ZM8uQBiSbh-z4FysIL5JxTekTsEY2sBFq5O7C9opUc8jQFeY_uEjNNccVd.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=rhpWhb25DLp4nMj7I1T53iB0_XqzVCTHEzlPC3_e2Ps&cs=540x0",
    category: "Горячее",
    weight: "100 гр"
  },
  {
    id: 44,
    name: "Долма",
    description: "Свинина, говядина, рис, виноградные листья, специи. За 1 порцию (4 штуки).",
    price: 210,
    image: "https://sun9-38.userapi.com/s/v1/ig2/1r25A_4k0L1U5lKujMvL-_9TS_JWhx3tYr7JqUGz9s9Kv7xNnSO2wMXtTB7VFz1Ipb5uFyd4Kp6R1fyVN3GgqlBS.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=UgRjJesuMOMN5Uz3qgNcnoiE7xgTU9ZxAQM4J2ImrVA&cs=540x0",
    category: "Горячее",
    weight: "4 шт"
  },
  {
    id: 45,
    name: "Голубцы",
    description: "Свинина, говядина, рис, капуста, специи. За 1 порцию (2 штуки).",
    price: 160,
    image: "https://sun9-20.userapi.com/s/v1/ig2/1VPCYrr39TZWYRv_2OsPxyRgrhrmbCO_oHBATgi_PBGHZ1Xsm6rYHtiem6UVCPiKNWO61ffFRDvnuxl3DPZW5g_0.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2048x2048&from=bu&u=-gAZVbwa8w4mOxuMxErQnlRDCbYzZThmq-2Z5ONhgio&cs=540x0",
    category: "Горячее",
    weight: "2 шт"
  },
  {
    id: 46,
    name: "Жульен в корзиночке",
    description: "За 1 штуку.",
    price: 350,
    image: "https://sun9-42.userapi.com/s/v1/ig2/AAIhLaBjd5pjLe2yLWhXS17sEIuXWL4Q98z7sRh2KroA5rG-dTN8hpMtPD-VAed_ovtPiJFNw6YhhvU0GOhrjt_G.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=cOi9GuNe1U8NFY48yOaXh75K0bWRf22GT9qZsWrSfys&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 47,
    name: "Лазанья",
    description: "Говядина, томат, сыр, соус \"Бешамель\", специи, тесто для лазаньи. За 1 порцию.",
    price: 350,
    image: "https://sun9-20.userapi.com/s/v1/ig2/WKPEDCPA9tQ3WnKoivi491cdcbe6JrQ6NT1EfVTwSxu3T3HOgSohScodV7TRJ7nABfVeOHR0mGHJCffNiZrRc6hC.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=3DEIWbUlHwzpEJzoSvaPYmU7zgLMC_H8JwUfN4UzHFI&cs=540x0",
    category: "Горячее",
    weight: "1 порция"
  },
  {
    id: 48,
    name: "Леоновый блинчик",
    description: "Блинчик, курица, кукуруза, помидор, сыр. За 1 штуку.",
    price: 110,
    image: "https://sun9-52.userapi.com/s/v1/ig2/iXNyDPbI_cDYWszaQEBcLWa7BoLPj-hBj5T9vryVQSt02hpSAxzdN90p42JbmlwcJ156xj18XZPAB9-QYw92ud_Z.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=DZLp6uHah8Vd-VYoit6xEw76h4JyxGy_wesLPEFTW3c&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 49,
    name: "Блинчик с мясом",
    description: "За 1 штуку.",
    price: 70,
    image: "https://sun9-50.userapi.com/s/v1/ig2/z66CH9RUaD9sa6pF2oeYNlwYOF5ePj0OTVx_RE00wIr31qhkid4t1exeQXTK4bhDTJeWHTgy9UMURXTbV2g-uQra.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=12Ew-bONh8V8RtYvmLu1cfWUlaMzWSEfhWuSKuXmZ6g&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 50,
    name: "Блинчик с творогом",
    description: "За 1 штуку.",
    price: 50,
    image: "https://sun9-88.userapi.com/s/v1/ig2/AHVTEhxzy5klNjuImuf4B3lGKYQU97OFFflxZ-VubgLMCVw8uF8OcGB723usVDZrKxO78lyNvYcryqyDMzIqzrjx.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=UKaWqv6-c75z7mOdjorKRWvV1bYwJ6Ay9UgalRB4vus&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 51,
    name: "Картофель с грибами",
    description: "За 100 гр.",
    price: 100,
    image: "https://sun9-70.userapi.com/s/v1/ig2/cJtyQMyo5DAAsS8osPHlOKtyvlxmRGsezFISSl38dJo4Avo-NVJfvVx6EC95ubVufw7jVfcYUevD2puRnkBlZPwq.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=r4oWEepTYPCbY-jzGm-dvTeUeqLg5T5g_5YMyX4n1BY&cs=540x0",
    category: "Горячее",
    weight: "100 гр"
  },
  {
    id: 52,
    name: "Курица \"Терияки\"",
    description: "Куриное филе, соус \"Терияки\", лук зеленый, кунжут, специи.",
    price: 150,
    image: "https://sun9-53.userapi.com/s/v1/ig2/F2ow8RDoY03u9iqAciHk1HZF6skPry6UhDuVgUwcq5mDl1lt0gAvhXVgVSpMYR5Mq1dzgValmV9JTLBLb7eZ2KAf.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=xeVwlroMPzwfdzf2G_KnrDlcVbcSVCkNlYtfJBKvCvs&cs=540x0",
    category: "Горячее",
    badge: "Новинка"
  },
  {
    id: 53,
    name: "Манты",
    description: "Говяжий фарш, специи, лук репчатый, тесто. За 1 порцию (2 штуки).",
    price: 150,
    image: "https://sun9-65.userapi.com/s/v1/ig2/rnkkY5OjaIntobSIe8zYRAL5fNuZLxblJYwo4NYpRYY_bjihtXOluOCVNd7SXyXSPWCsk6_Vi3L03tK8VRLW19-k.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=NpkfwKeyCtdn4CbYOI7oSrGVtmeBJKsktBMdNVZwHiI&cs=540x0",
    category: "Горячее",
    weight: "2 шт"
  },
  {
    id: 54,
    name: "Плов \"Узбекский\" с курицей",
    description: "Рис, курица, морковь, специи. За 1 порцию.",
    price: 200,
    image: "https://sun9-85.userapi.com/s/v1/ig2/LRc-Qx5K-fYeLnMwnuBw_O3L0-eSQgI0pBYdiH2IWXk3nTC0ES9unE_bkBMxrlFQ8FqXvl3hDzH1hsoPNCs_4fQR.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2048x2048&from=bu&u=Z_qeDKrOmKJyeOfRrzzsyPDhGej6UIKuHAHVk_UIhZM&cs=540x0",
    category: "Горячее",
    weight: "1 порция",
    badge: "Хит"
  },
  {
    id: 55,
    name: "Рыба \"По-милански\"",
    description: "Филе минтая, морковь, лук репчатый, специи, сыр. За 100 гр.",
    price: 90,
    image: "https://sun9-6.userapi.com/s/v1/ig2/nW4H-LfhD-2SVukACTAFX554jmnXYusjN28O1db0cotsgjp0he02p4RlFvTnWpwlVw4RFnXPVy98I9G-83px2ECm.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&from=bu&u=4DdS0vcjUqLSHOvZRjcF1dTNwQ_cwnlMlhXJ3YARTOQ&cs=540x0",
    category: "Горячее",
    weight: "100 гр"
  },
  {
    id: 56,
    name: "Котлета \"По-французски\"",
    description: "Куриный фарш, говяжий фарш, огурцы маринованные, помидоры, сыр, специи. За 1 штуку.",
    price: 250,
    image: "https://sun9-25.userapi.com/s/v1/ig2/cT-QEg4ya51ZdhMCNASNwfWro3DQMfUa1lprf7dvr4E-qkodf5j08PtgCkNduyY1VjYGlmYZ4mqlOrbsoVfy7u5i.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280&from=bu&u=yih9mUkNxDtvUJAeWDkhvqviIB1XGxJ08D4sx8dLn-4&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 57,
    name: "Жареный сыр",
    description: "За 1 штуку.",
    price: 60,
    image: "https://sun9-21.userapi.com/s/v1/ig2/OciUZLe76Bk7YqusuKEYjdOwYF6rA6ypJG5uwM5jqLMvNe2TTE6EN3JWCrGoSmUMDaEaJNkoFr_jphJAGK_MUno3.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=pwJ2DOSsswnw2ALK__3-rQvh65HmrJHkTmqV6XJ3Zto&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 58,
    name: "Нагетсы куриные",
    description: "За 100 гр.",
    price: 150,
    image: "https://sun9-21.userapi.com/s/v1/ig2/5rm7vu6MqWiqaWd_23b6q4-LDcWissJZzvv1Ne8DBmHOOhkBeqQT8KRhxg_-8gz8963AIMKDzd8ePGKhLNzvAO7x.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=6DKglBruTmldeWZR_2z-eyb7I-L69-H-13pq3RMqU1w&cs=540x0",
    category: "Горячее",
    weight: "100 гр"
  },
  {
    id: 59,
    name: "Хинкали варёные",
    description: "За 1 штуку.",
    price: 70,
    image: "https://sun9-84.userapi.com/s/v1/ig2/E4k2j1fZv75MXSKPN-X7fHR6PpTORmuIMkCX_iVUimoZe7l_qbO-XgljgKNSRlSr5rmew9w0CNwyWRP43MoYBrAR.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=Cypd9ZZuG6Pz_iY_MqRGZvqi0ysep_PRPjWRM_qGbMc&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 60,
    name: "Хинкали жареные",
    description: "За 1 штуку.",
    price: 90,
    image: "https://sun9-50.userapi.com/s/v1/ig2/FHCbdB2d_iZyuNZxDa27GznUuG0Bm_OPuw_vEuMj4V7PFHum-vT8nkFhuw_5dO_fjXKHYbYDx7rEd_1oY4ki-obp.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=v0KZ6wJBNizUJ6UkRIGYW5WaEmGNsKOc9aFBPrBWM-U&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 61,
    name: "Тжвжик свиной/говяжий",
    description: "Свиная/говяжья печень, сердце, перец болгарский, лук репчатый, специи. За 100 гр.",
    price: 120,
    image: "https://sun9-72.userapi.com/s/v1/ig2/ejxBTb7IijYzLlyAk7nA0IXQN02tLQzzlh92Vd5zkksrzOpMsU7IypUHXqO4JeOLJfrM0Gfjt6PPyLn5ljJwM_C5.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,1732x1732&from=bu&u=1mRffsRxNJngCo0QxmY6_OmFPhn48Itqwm7i1Ymwrxg&cs=540x0",
    category: "Горячее",
    weight: "100 гр"
  },
  {
    id: 62,
    name: "Запеканка куриная",
    description: "Куриное мясо, грибы, перец болгарский, помидор, специи, сыр \"Моцарелла\". За 100 гр.",
    price: 150,
    image: "https://sun9-54.userapi.com/s/v1/ig2/g9Ou-kA1xvM1JFTrmAXp87i6pcyonffaJf2sJ8G5Xt3iRwi-mu0aT5cHbEAGDVoddHYUn2Mm3z16Bygn1CAAPGq3.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=w-slHyfy4nAw4lJX5kBqdPVbyjiSyWCGT7cykv6dxx8&cs=540x0",
    category: "Горячее",
    weight: "100 гр"
  },
  {
    id: 63,
    name: "Куриный рулетик с творожным сыром",
    description: "Куриная грудка, творожный сыр, сыр \"Гауда\", помидор, зелень, специи, майонез. За 1 штуку.",
    price: 160,
    image: "https://sun9-59.userapi.com/s/v1/ig2/ClfZAQ3S4hvzVVPSDlrc1_0sLQiD8dc7ylUesRE8W5OwG9fR6cux1r6GfGNA-i5cPf0DjlSNqBHt9FpY-cMctrw-.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=_qXQQKmkwJnZBmxzT6lN3uYTm3c7DZFvcCiAqVImKPo&cs=540x0",
    category: "Горячее",
    weight: "1 шт"
  },
  {
    id: 64,
    name: "Баклажан с мясом",
    description: "Баклажан, говяжий фарш, помидор, перец болгарский, специи.",
    price: 220,
    image: "https://sun9-16.userapi.com/s/v1/ig2/QWh8SN3YvX7FHmeKjkFZpaUHRh4VS-zRlWxKstG6ptqk10YSPh7tP4wvCNKDjYX37GI5j6-yG29qvudR6A2Xl4rA.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2048x2048&from=bu&u=DSLOE5TYC-YIdFOsZHQIeZjqlQ1VDQGki3sS_toP9VE&cs=540x0",
    category: "Горячее"
  },
  {
    id: 65,
    name: "Мадам Бовари",
    description: "Свинина, картофель \"фри\", грибы, сливки, специи. За 100 гр.",
    price: 200,
    image: "https://sun9-83.userapi.com/s/v1/ig2/bOxiRQMijbxeWumum042TRgOYovndZ9jrXuH94wzOSJ6-20wxg1fvoh5ZzayNaHH4dVa71zj9aGTTGWSWxRKgtpm.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,673x673&from=bu&u=zRAwsp9apoqoqSyTV3baaasphMmqrm9BmiOg8hMm4rs&cs=540x0",
    category: "Горячее",
    weight: "100 гр"
  },

  // САЛАТЫ
  {
    id: 66,
    name: "Салат \"Сельдь под шубой\"",
    description: "Филе сельди, картофель, свекла, морковь, огурцы соленые, лук, яйца, зелень, майонез. За 100 гр.",
    price: 90,
    image: "https://sun9-36.userapi.com/s/v1/ig2/ejFWmLoEvo6LDA0YIQt7CZOa5Wp887BmX6Uo9rvvDDOAU-T_XwMhZi2-Osz4IgMsRxZenRUdRG2vOa-iJPPA2P5b.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=jbZwKYmQaS2_G2iPoMDCckBWaZ6-jpiWDYoq6R3q5_Q&cs=540x0",
    category: "Салаты",
    weight: "100 гр"
  },
  {
    id: 67,
    name: "Салат \"Крабовый\"",
    description: "Крабовое мясо, рис, яйца, свежие огурцы, кукуруза, зелень, майонез. За 100 гр.",
    price: 120,
    image: "https://sun9-85.userapi.com/s/v1/ig2/sNBzTSGH-ckC-siBd5JrzSF7he9B6RneNSRCFCbr5DVqiY1x2LsTysgbl2y0v7jnMcMjLhzzyjwzmEzt3oiepdfT.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=a5hx2S0AAZiMLWoDd0tLvDSZosI_fhvbS7m3hEcwiu0&cs=540x0",
    category: "Салаты",
    weight: "100 гр"
  },
  {
    id: 68,
    name: "Салат «Оливье»",
    description: "Картофель, морковь, огурцы солёные, колбаса вареная, яйца, горошек, лук зелёный, майонез. За 100 гр.",
    price: 90,
    image: "https://sun9-66.userapi.com/s/v1/ig2/1IfZUaORr35x42ZvBC-NqOI4arqZ7YAYZGXcmF-Uxy1RFZlsttkM0Jn3Er_QeH9ClGhjZSwF0Ac7K0sLT-HoMXKI.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=2D0IEeZEUN683SX-a_J_dZQvG1qBDSIZwTaGZ9fBSDg&cs=540x0",
    category: "Салаты",
    weight: "100 гр",
    badge: "Хит"
  },
  {
    id: 69,
    name: "Салат «Цезарь с курицей»",
    description: "Курица, сыр, помидор «черри», зеленый салат, яйца, сухарики, соус «Цезарь». За 100 гр.",
    price: 110,
    image: "https://sun9-83.userapi.com/s/v1/ig2/ld8sWaa1z2BLlEuXqE4uW-Bu9-M6zjj6cczylsM1tt_Ip10YTsBkk1Mldeh8e9SUxbLMTNQg1GAhYnlmoyqED6uA.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=a6R0S-2kzqIBcH1vxGvVQ-Sv-VAWmMpDOBcwqIwMTqE&cs=540x0",
    category: "Салаты",
    weight: "100 гр"
  },
  {
    id: 70,
    name: "Салат «Овощной»",
    description: "Перец болгарский, огурец, помидор, соль, масло растительное. За 100 гр.",
    price: 100,
    image: "https://sun9-21.userapi.com/s/v1/ig2/Gm36xYUIUu1VWvhEEFToecnKThRwrBXOXQuziWzoWtrMUI7dEnzZSl1FxaQZj0e_HIUYMWvr_CGfWhXhHaecZNeE.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=Ct7NSaqzE9gNJE6xDe9DCt3jzPsdCZfO-f6OrU9kcxg&cs=540x0",
    category: "Салаты",
    weight: "100 гр"
  },
  {
    id: 71,
    name: "Салат «Ромен»",
    description: "Салат «ромен», редис, зелень, масло растительное. За 100 гр.",
    price: 130,
    image: "https://sun9-27.userapi.com/s/v1/ig2/uR2BjRQBL4xrOWvkzA81z5TslIR-V3eigE7Pl6S2xfZ6NlS3ySl4MQmziNpj2n0H37cub_MNAdMaylfMlVZeKm2I.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=DCm0OIDNZLnoWg4TgQNjMTc2_YRbMyH_zw1G23OaI_Y&cs=540x0",
    category: "Салаты",
    weight: "100 гр"
  },
  {
    id: 72,
    name: "Салат «С брокколи»",
    description: "Брокколи, перец болгарский, морковь, зелень, масло растительное. За 100 гр.",
    price: 100,
    image: "https://sun9-52.userapi.com/s/v1/ig2/fv4hCmdjusYNZc_JhVJBClSYR0RCmQzVEdF8Qh2FZoWHTTEbX1y4Vfc-LV2vu7zTIERakPKWP6nqbOzkEZyB4JG6.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=3VfNFs2kvaK6cZ_MIYhi6jNmqEAcaTtFepvYhrRC0eA&cs=540x0",
    category: "Салаты",
    weight: "100 гр"
  },
  {
    id: 73,
    name: "Салат «S.A.D. FOOD»",
    description: "Говядина, орех, грибы, яичные блинчики, майонез. За 100 гр.",
    price: 130,
    image: "https://sun9-71.userapi.com/s/v1/ig2/E1ImMmAvVbcvi4JDitf_GpPlyvHin70Vd3pVqQSYFGWsXiWIDCY8B8ACofIW-a4e7UzyGAGm6xHLy3uuK_gSYF8t.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2048x2048&from=bu&u=IWLpKDq8krF4djOZ9sxSpEhownIVQ2Acaw6H2o7kvoc&cs=540x0",
    category: "Салаты",
    weight: "100 гр",
    badge: "Хит"
  },
  {
    id: 74,
    name: "Салат «на мангале»",
    description: "Баклажан, помидор, перец болгарский, зелень, специи. За 100 гр.",
    price: 80,
    image: "https://sun9-52.userapi.com/s/v1/ig2/lWSxJ4hGaGWlRvzCPzUvFPCl2WirRn0Y8eaJ9W2B9kIeLO3-T6P7JetEDKfzzSZ4YxvEQhmoe8yPYpClbnm7LMqT.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=BUOCbb3TwEbLLWl6_zbT7AzXI85ssPRCAnP3Y3xkIcA&cs=540x0",
    category: "Салаты",
    weight: "100 гр"
  },
  {
    id: 75,
    name: "Салат «Гусарский»",
    description: "Говядина, помидор, соленый огурец, чеснок, сыр, специи, майонез. За 100 гр.",
    price: 120,
    image: "https://sun9-61.userapi.com/s/v1/ig2/ZNrIYhRPtbWwzLdGgrFU4X7wDgkz_0xGwe6ALgNZeBmT4e3JoPEes8Je3DQubCfGQq92q40nm7bGZ60I0jPLro1A.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2048x2048&from=bu&u=lBfhEx_JKfsmURXmcB9yoVy9Fa3Qwwcurqj9UfFEmaw&cs=540x0",
    category: "Салаты",
    weight: "100 гр"
  },
  {
    id: 76,
    name: "Салат «Из курицы»",
    description: "Куриное филе, морковь, кукуруза, огурец, майонез. За 100 гр.",
    price: 90,
    image: "https://sun9-17.userapi.com/s/v1/ig2/XqeMHHXfYSlR2YZQFXRMYrNBBUAqJEI0Ea8in1BvwQ-1A20T7o_3y_F4RJSx-tAqGoYIDqGkc3hGtkxoS515v5Ls.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2048x2048&from=bu&u=k6_oAEPi1-hSxBIqrhQa1YMecP4HtG0FjYvwkOr18BY&cs=540x0",
    category: "Салаты",
    weight: "100 гр"
  },
  {
    id: 77,
    name: "Рулетик из баклажан",
    description: "Баклажан, творог, чеснок, орех. За 1 штуку.",
    price: 45,
    image: "https://sun9-49.userapi.com/s/v1/ig2/ckquxP5gZdn6aSRDxkbyHprF4X42uaLB2p6UrRXQiwcGptfWhOzTqsvoEQUd6M8-Y9_yhXlguonjOHRlKSaONjwq.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=cHhQj1uX9SceQczfAHwaLS9S5dngDf48JH_LMS9kj6g&cs=540x0",
    category: "Салаты",
    weight: "1 шт"
  },

  // ГАРНИРЫ
  {
    id: 78,
    name: "Картофельное пюре",
    description: "За 100 гр.",
    price: 45,
    image: "https://sun9-54.userapi.com/s/v1/ig2/4J6K89fd4ew8Lyihv_nek4llJ5iklWoPJvjV39zMbEPzUx_mPl1DISeweXwrgQm_fzQzB_3UYX6VkK8HrKwCB56v.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=czAls0paqW-bH8lp1URqnMr30sbjpEqy0wOg2dNZRws&cs=540x0",
    category: "Гарниры",
    weight: "100 гр"
  },
  {
    id: 79,
    name: "Картофель «фри»",
    description: "За 100 гр.",
    price: 120,
    image: "https://sun9-80.userapi.com/s/v1/ig2/y747wXvPPw8Tbw1rpTyCTF4HH1j8GfhpKhj5zPseKPn90GVVmvmyWDMmKLXLSHkJ1-V6Oh7A3PDzJSDidyZaX1kb.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=VfAk9m0136ANw08wNRmGwQhLLmnWILC7PnScu_9-XhU&cs=540x0",
    category: "Гарниры",
    weight: "100 гр"
  },
  {
    id: 80,
    name: "Картофель запеченный",
    description: "За 100 гр.",
    price: 80,
    image: "https://sun9-10.userapi.com/s/v1/ig2/Z1zxmGfs_y3rd5qHrx9sF0iKi65WjTxqpP1yH43clA0YcOLHUvhf4J5CycSRhLx7SBvMY-fyonNMTeB93FbtU9cI.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=CbrVAM8Kdlu4hzpgSE0mAbwk_eDlo8hmsJp_zvUeEeU&cs=540x0",
    category: "Гарниры",
    weight: "100 гр"
  },
  {
    id: 81,
    name: "Рис с овощами",
    description: "За 100 гр.",
    price: 80,
    image: "https://sun9-71.userapi.com/s/v1/ig2/zEms_lObOKXh-byII7-BZ6-FXXVGfRpqDczfoPQRTGnIYBWvGAHQSoAd52a6ha5If9P3Q1lz38TJU38GPFmavfO7.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=kTqgW9atvYqdHM3uKQ-o65Pbz5nHTdjGGVBceVHS1i8&cs=540x0",
    category: "Гарниры",
    weight: "100 гр"
  },
  {
    id: 82,
    name: "Макароны",
    description: "За 100 гр.",
    price: 80,
    image: "https://sun9-51.userapi.com/s/v1/ig2/XTMzoGvcePStdBXz47ruq1GKLXxUO1nQjHdTmWuQUxvGVqhyc5dj9v4cRwOt_eKFZHTQZw-YD7r2ykF2mawZg1qB.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=M2yi4WXgyvoKMys-kWUiEhS_tlE1zcbMghV8w6GRnQA&cs=540x0",
    category: "Гарниры",
    weight: "100 гр"
  },
  {
    id: 83,
    name: "Гречка",
    description: "За 100 гр.",
    price: 40,
    image: "https://sun9-45.userapi.com/s/v1/ig2/4-teDvusgtVBWjDmJdjQb-MKe9LR7Hg_mjYLfJJYYw73t7gKTz9qP2bdWHpeoopfTnonV2RKmZfXyx1qxCklyklj.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=7nu3F6R90uQSoqi1cDV-XgPcxyduRpXE5CgFWI98Vs4&cs=540x0",
    category: "Гарниры",
    weight: "100 гр"
  },
  {
    id: 84,
    name: "Макароны в сырном соусе",
    description: "За 100 гр.",
    price: 90,
    image: "https://sun9-74.userapi.com/s/v1/ig2/ScT9DssdvYTZzxdoqkOuPH82DAHYwkKDRkBdcIuWfd31Z_1kjLOrghxtCfZ8OXH1wIeJJFV-GrnRMft-Vc1BqcUR.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=Ie-AexWr_6OPDUIp8kKrO9oHQ9X9OhkRbNEW8ZOpClM&cs=540x0",
    category: "Гарниры",
    weight: "100 гр"
  },
  {
    id: 85,
    name: "Рис отварной",
    description: "За 100 гр.",
    price: 40,
    image: "https://sun9-14.userapi.com/s/v1/ig2/ocwdxWDKQARQ70ekFMofHswMwY2qZbXRWKcgZdzePQXuHrLaL3GMOQ85kVlj_wXyrRW-463brHCnZKXK2Cn1g6wo.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=JnEDpuPNKxUsBIX1KnTjrYd-Q5zi0ISOAAQSOxB7cOA&cs=540x0",
    category: "Гарниры",
    weight: "100 гр"
  },
  {
    id: 86,
    name: "Цветная капуста с яйцом",
    description: "За 100 гр.",
    price: 70,
    image: "https://sun9-88.userapi.com/s/v1/ig2/WPnHiqnqK9OM-ER2UlxbFGta1_CWlONLRTTWgRl4BZVb9z4BRAclmQbJ12StnIV9sMtBc6yMdb5X9WNjFs9XJVjN.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=RnGbvNA_tpMATkzM-Sab7mguvHPBuEV--90bHoHippw&cs=540x0",
    category: "Гарниры",
    weight: "100 гр"
  },

  // МАНГАЛ
  {
    id: 87,
    name: "Куриные крылья на мангале",
    description: "За 1 шампур.",
    price: 270,
    image: "https://sun9-51.userapi.com/s/v1/ig2/Zecj_jJPtDKrBZn7Dp04XMsmKts8bGHG3Z8xAHGjjlVawUHNSkg70WCZ2klv1iFgtzfxdHxgl-n5MjieT854DYVm.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2048x2048&from=bu&u=84kiqwf-INHZzg1dCyeQK6JXgqiD1xsmW9GJZekZx1s&cs=540x0",
    category: "Мангал",
    weight: "1 шампур",
    badge: "Хит"
  },
  {
    id: 88,
    name: "Шашлык из куриной грудки",
    description: "За 100 гр.",
    price: 120,
    image: "https://sun9-48.userapi.com/s/v1/ig2/-_JqDnGa8pmS6XTFxvm3BqTyU2Sa9zvvMGFoShqAMYb8_hD4z0WC1yIHmlK_f8G5nwfriEFGzxYcMsswEiB_Y4AD.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&u=dgb1_vpx4x70A6LbAVjw3PUfZPMloD9b6F5CUsZYl3s&cs=540x0",
    category: "Мангал",
    weight: "100 гр"
  },
  {
    id: 89,
    name: "Шашлык из свиной шейки",
    description: "За 100 гр.",
    price: 140,
    image: "https://sun9-45.userapi.com/s/v1/ig2/f3lItA36DFdB78mm7zLyIre8vdhP55qSJux1lQJSA8oBxNcWL0_CoOK5myywsvYFvBf9GQ9m7Az6sIDC97DKh1ha.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=VbD7B6qdIShj5O2UkUdrlb3NH9Y0msnCBHDz0WutbdM&cs=540x0",
    category: "Мангал",
    weight: "100 гр",
    badge: "Хит"
  },
  {
    id: 90,
    name: "Шашлык из свиной корейки",
    description: "За 100 гр.",
    price: 140,
    image: "https://sun9-88.userapi.com/s/v1/ig2/xacfCeHX87sElmimnUmkVPvg9HUY6Y0pPeUsHnzQu0DF1Tlhx2F9-N_RPILsnLEAqEs9CSobqWJ5IerTwqctpGH8.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=wlQi9UzIxCVAPokzzLLiDiGOUkhDcLBJFBnM4-tRGiY&cs=540x0",
    category: "Мангал",
    weight: "100 гр"
  },
  {
    id: 91,
    name: "Шашлык из баранины",
    description: "За 100 гр.",
    price: 270,
    image: "https://sun9-82.userapi.com/s/v1/ig2/1SN51Y2XapNsqsFv7jmVRG_wFKckdunSZXbD_nhoUhQ2qqaRwTcBuDU1EtWXuMI18QwzKphR-ddyju63tNJPbKy4.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=GBSLzsN04g5ywkaqiG2TGFrShyNf5rcdQEbPEStqKZE&cs=540x0",
    category: "Мангал",
    weight: "100 гр"
  },
  {
    id: 92,
    name: "Сёмга на мангале",
    description: "За 100 гр.",
    price: 280,
    image: "https://sun9-80.userapi.com/s/v1/ig2/7x_U2CnLW-NlBEfpjDVVlXIQDttuHc0ufI-G3AUdNexxIn-huc-pTIS0Q8hr89QAvzimCiMstLq8gebcMysDVbEu.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=htkpFNjmAWrqt8mSkefknTvGzxrMbzEu_U6EQk4RHdA&cs=540x0",
    category: "Мангал",
    weight: "100 гр"
  },
  {
    id: 93,
    name: "Люля-кебаб куриный",
    description: "За 1 штуку.",
    price: 200,
    image: "https://sun9-45.userapi.com/s/v1/ig2/ehSPyeUUZhoUnGL5QbM302EOrs6aazwEwaclGtDTtkrP5EavR-WQkCuFhAonR2_qh9M9wyZuUl72SgO95jtcxqgx.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=TvS_j-hmR1xtH6_wgIk5W2YHjk1aB2NiEC9E32HKS_s&cs=540x0",
    category: "Мангал",
    weight: "1 шт"
  },
  {
    id: 94,
    name: "Люля-кебаб говяжий",
    description: "За 1 штуку.",
    price: 250,
    image: "https://sun9-2.userapi.com/s/v1/ig2/69WTe2LtMpLQqrIDcC0V-HLZJLqtheC1cryIx1uTPxvj2BfwmdPHxGP_3WD01-IIGfC-MSvaotPn1CiA9U6cTXZ4.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=c1CieP1uFWpnmg9vv387ojUtPlYozPAfCr5-woOYU_s&cs=540x0",
    category: "Мангал",
    weight: "1 шт",
    badge: "Акция"
  },
  {
    id: 95,
    name: "Картофель с салом на мангале",
    description: "За 1 шампур.",
    price: 150,
    image: "https://sun9-14.userapi.com/s/v1/ig2/KZ3DbeD7X3FC2BFacogsIOmwvj4MFRD7KMzwl8t3OH1Yp-uX7rNJcGCi-KwBbr_lG70GM4ef-WT9pu9ZqXmJSlAa.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=LoBkyKLUdBnXDQWYEceeFeskkqNwlW5LL0PHmqMN8JU&cs=540x0",
    category: "Мангал",
    weight: "1 шампур"
  },
  {
    id: 96,
    name: "Грибы на мангале",
    description: "За 1 шампур.",
    price: 200,
    image: "https://sun9-38.userapi.com/s/v1/ig2/fdSnC1-hfrgOS6ZbtbuvJRrtdXn23EiUG080sFGc8ckLpbWS2SVNMasWjPrSxuNXFrZyDKAEUXXLcJBwgCF4S87I.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=lQN5sIP2KvanpA8M3Qvo24zAGXq5njVronzIXdiI_v0&cs=540x0",
    category: "Мангал",
    weight: "1 шампур"
  },
  {
    id: 97,
    name: "Грибы с овощами на мангале",
    description: "За 1 шампур.",
    price: 200,
    image: "https://sun9-42.userapi.com/s/v1/ig2/-rO8TngwM5arpPhP3RWhRSE-I_-6PerBw-XyHtJLejRCfh1-D4PbUTmgncEloadARsMlRaCpat9GmM270zCaLxgs.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=m5sh1h75mTDoR55nY721r0cnEhz6i8ux8VW1tuxbu7g&cs=540x0",
    category: "Мангал",
    weight: "1 шампур"
  },
  {
    id: 98,
    name: "Шашлык из говяжьей вырезки",
    description: "За 100 гр.",
    price: 300,
    image: "https://sun9-80.userapi.com/s/v1/ig2/KIJ6rxH5U6dnPpuGp43y7oX6HB92U_pFpkTVGPsJnbXE1tSlzAIfmiWLZeFJKpOC7h95ykAKWjcQLxHUH-mJgXiO.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440&from=bu&u=eNkMNpXauwy06qReJ4tRGGAFgGiBYr-dqleEiwRyIgw&cs=540x0",
    category: "Мангал",
    weight: "100 гр"
  },

  // СУПЫ
  {
    id: 99,
    name: "Суп «Гороховый»",
    description: "За 1 порцию.",
    price: 140,
    image: "https://sun9-34.userapi.com/s/v1/ig2/i5XZz6TFtHETtliHu63A9u0Sil6YkaAuAdgLp55fmweN9c1N4jhkBfBFD6FKj2olVU8S6bUgQZMlJrMIQPbNJbVh.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,768x768&from=bu&u=QX5aItwnln7U_OCYnrTcOxFOjBxjPdgrYoj5n2XK8Hw&cs=540x0",
    category: "Супы",
    weight: "1 порция"
  },
  {
    id: 100,
    name: "Суп «Борщ»",
    description: "За 1 порцию.",
    price: 140,
    image: "https://sun9-82.userapi.com/s/v1/ig2/QrNqkMuReqne6yItuhE7It3OR3Lvgu1ZoAu-s38Cz8fFIAwrKQn3-3hRgbo5DcngC5RKsRXDHeFnIWkazt5TkV7V.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=6ld0av9hjxEdpDUN3q1jLLS2si2_Kv9N_gewH3DWq6Q&cs=540x0",
    category: "Супы",
    weight: "1 порция",
    badge: "Хит"
  },
  {
    id: 101,
    name: "Суп «Куриный с лапшой»",
    description: "За 1 порцию.",
    price: 140,
    image: "https://sun9-68.userapi.com/s/v1/ig2/llN2OwKKHd3VLPbqQ5SDuYzUHppTtDAzfLNIkiXHmWgpvcteuYi6AFyt_Mrb2JXmcq4OO0ePE2f2v41GK6E5bIgm.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=fC6yaG11Iemd-jrUiU8qBq-XNQlEBUfUEzesVWHL2jc&cs=540x0",
    category: "Супы",
    weight: "1 порция"
  },
  {
    id: 102,
    name: "Суп «Том ям»",
    description: "За 1 порцию.",
    price: 250,
    image: "https://sun9-54.userapi.com/s/v1/ig2/5_ceyyFWETSgPii3edq12DpuGQ2-M77BO7BtIcnGlHTgB68kJQXXoyvmcXa7ezFMmel8CFHORK_BzpXtTnKtAIe0.jpg?quality=95&as=32x22,48x32,72x48,108x73,160x108,240x162,360x242,480x323,540x364,640x431,720x485,1080x727,1280x862,1440x970,1476x994&from=bu&u=g7XMyLkm4uYozcwI6gH0hj29YQlZX-lL_2PS4QdJi_4&cs=1080x0",
    category: "Супы",
    weight: "1 порция",
    badge: "Острое"
  },
  {
    id: 103,
    name: "Суп «Солянка»",
    description: "За 1 порцию.",
    price: 200,
    image: "https://sun9-48.userapi.com/s/v1/ig2/6Okfyh_krJotOWugnDjd3Oq4SQ9LG2gVCmVlbyBWIXMZW04fgjMMGTQYmaWsHOsNv3icEriiHFFPnJeYs2FqB_uG.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x119,240x179,360x269,480x358,540x403,640x478,720x538,1080x806,1200x896&from=bu&u=mYhsWw_h3HRZ6OtEQc8YD0-F4ivCnRxPLHhXNnVL5SM&cs=1080x0",
    category: "Супы",
    weight: "1 порция"
  },
  {
    id: 104,
    name: "Суп-пюре «Грибной»",
    description: "За 1 порцию.",
    price: 200,
    image: "https://sun9-71.userapi.com/s/v1/ig2/KLVKKpTir-VeLeyHVpg2cYBcFvYj7bvbp5hNvi4Xitw0L4M3dgC3mr403qB7ZpFrAvyWi1v1-C_Vox9-n6Qum3Zj.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=pW8mKmkS-GlA0sicJkdS3V1ixegZgLLz_Gt2Xr-5SCE&cs=540x0",
    category: "Супы",
    weight: "1 порция"
  },
  {
    id: 105,
    name: "Суп «С фрикадельками»",
    description: "За 1 порцию.",
    price: 140,
    image: "https://sun9-87.userapi.com/s/v1/ig2/TEV0MQBWkBxpQrt2txAJwxcAIpApTqTOh6L1DM76qDmw9xrXAVoB9NhjQUv2qrlVgSoCOV2zjq6k0My2MGEdJNcg.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x119,240x179,360x269,480x358,540x403,640x478,720x538,1080x806,1200x896&from=bu&u=_PZxXHQnvGVhsH848TWDJE6yYwc2suJZiF2R7gw840w&cs=1080x0",
    category: "Супы",
    weight: "1 порция"
  },
  {
    id: 106,
    name: "Суп «Харчо»",
    description: "За 1 порцию.",
    price: 140,
    image: "https://sun9-68.userapi.com/s/v1/ig2/Igh6zHeB6g00ZYG3XGBKa8DSuMTUnMKOVHNUe05eRYnoASgG4WOMdSQOVA5GV2NbuEw5xZBLZBBrnmKskjXied2g.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1024x1024&from=bu&u=ZtjZOFpqVU50nEZCmUNaxikhAADavj_XW47UqCjVhAA&cs=540x0",
    category: "Супы",
    weight: "1 порция"
  }
];

export const categories = [
  { id: "all", name: "Все", icon: "🍽️" },
  { id: "pizza", name: "Пицца", icon: "🍕" },
  { id: "russian_oven", name: "Русская печь", icon: "🔥" },
  { id: "rolls", name: "Роллы", icon: "🍣" },
  { id: "bakery", name: "Выпечка", icon: "🥐" },
  { id: "hot", name: "Горячее", icon: "🍖" },
  { id: "salads", name: "Салаты", icon: "🥗" },
  { id: "sides", name: "Гарниры", icon: "🍟" },
  { id: "mangal", name: "Мангал", icon: "🔥" },
  { id: "soups", name: "Супы", icon: "🍲" },
];

export const businessLunches = [
  {
    id: 1,
    name: "Бургер-сет",
    price: 399,
    items: ["Чизбургер", "Картофель фри", "Напиток"],
    color: "bg-green-500"
  },
  {
    id: 2,
    name: "Пицца-сет",
    price: 450,
    items: ["Пицца Пепперони (20см)", "Салат Цезарь", "Напиток"],
    color: "bg-orange-500"
  },
  {
    id: 3,
    name: "Грузинский сет",
    price: 490,
    items: ["Хинкали (3шт)", "Хачапури", "Лимонад"],
    color: "bg-purple-500"
  }
];
