import { useEffect, useState } from "react";
import { APlayer } from "aplayer-react";
import "aplayer-react/dist/index.css";
import axios from "axios";

export default function Player(props) {
  const { musicList = [] } = props
  const [playList, setPlayList] = useState([])

  const getNameList = (musicList) => {
    return musicList.map(v => v.split(/[/.]/).slice(-2)[0])
  }

  const getPlayList = async (musicList) => {
    const nameList = getNameList(musicList)
    const lyricsResult = await Promise.allSettled(nameList.map(name => axios.get(`https://api.lrc.cx/jsonapi?title=${name}`)))

    setPlayList(musicList.map((url, index) => {
      const { status: lyricsStatus, value: lyricsValue } = lyricsResult[index] ?? {}
      const lyricsData = lyricsStatus === 'fulfilled' ? lyricsValue.data?.[0] ?? {} : {}
      const { title, lyrics, artist } = lyricsData
      return {
        name: title,
        artist,
        lrc: lyrics,
        cover: `https://api.lrc.cx/cover?title=${title}&artist=${artist}`,
        url
      }
    }))
  }

  useEffect(() => {
    getPlayList(musicList)
  }, [musicList])

	return (
    playList.length > 0 ? <APlayer
      audio={playList}
      autoPlay
    /> : null
  )
}
