// characterId (백엔드 고정값, character01~character19) <-> 동물 이름/이미지 매핑
// 순서는 상점(BuyCharacter) 화면에 보이는 순서를 기준으로 확정됨 (총 19종)
// 이미지 파일 위치: src/assets/animals/ (12지신) + src/assets/characters/ (추가 동물)

import mouseImg from "../assets/animals/mouse.png";
import oxImg from "../assets/animals/ox.png";
import tigerImg from "../assets/animals/tiger.png";
import rabbitImg from "../assets/animals/rabbit.png";
import dragonImg from "../assets/animals/dragon.png";
import snakeImg from "../assets/animals/snake.png";
import horseImg from "../assets/animals/horse.png";
import sheepImg from "../assets/animals/sheep.png";
import monkeyImg from "../assets/animals/monkey.png";
import roosterImg from "../assets/animals/rooster.png";
import dogImg from "../assets/animals/dog.png";
import pigImg from "../assets/animals/pig.png";
import koalaImg from "../assets/characters/koala.png";
import lionImg from "../assets/characters/lion.png";
import lesserpandaImg from "../assets/characters/lesserpanda.png";
import raccoonImg from "../assets/characters/raccoon.png";
import dolphinImg from "../assets/characters/dolphin.png";
import sharkImg from "../assets/characters/shark.png";
import axolotlImg from "../assets/characters/axolotl.png";

const characterMap = {
  character01: { name: "쥐", image: mouseImg },
  character02: { name: "소", image: oxImg },
  character03: { name: "호랑이", image: tigerImg },
  character04: { name: "토끼", image: rabbitImg },
  character05: { name: "용", image: dragonImg },
  character06: { name: "뱀", image: snakeImg },
  character07: { name: "말", image: horseImg },
  character08: { name: "양", image: sheepImg },
  character09: { name: "원숭이", image: monkeyImg },
  character10: { name: "닭", image: roosterImg },
  character11: { name: "개", image: dogImg },
  character12: { name: "돼지", image: pigImg },
  character13: { name: "코알라", image: koalaImg },
  character14: { name: "사자", image: lionImg },
  character15: { name: "레서판다", image: lesserpandaImg },
  character16: { name: "라쿤", image: raccoonImg },
  character17: { name: "돌고래", image: dolphinImg },
  character18: { name: "상어", image: sharkImg },
  character19: { name: "우파루파", image: axolotlImg },
};

// characterId로 동물 이름 가져오기 (없으면 "알 수 없음")
export const getCharacterName = (characterId) => {
  return characterMap[characterId]?.name || "알 수 없음";
};

// characterId로 이미지 가져오기 (없으면 쥐 이미지로 폴백)
export const getCharacterImage = (characterId) => {
  return characterMap[characterId]?.image || mouseImg;
};

// 전체 매핑 정보가 필요할 때
export const getCharacterInfo = (characterId) => {
  return characterMap[characterId] || { name: "알 수 없음", image: mouseImg };
};

export default characterMap;
