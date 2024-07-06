"use client"
import React, { useEffect, useState } from 'react';
import mainBackground from '../../../../public/assets/images/hero-bg.png';
import { userServices } from '@/lib/userServices';
import moment from "moment";
import Image from 'next/image';
import Footer from '../../../components/Footer'
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { GAME, GAMES_LIST } from '@/app/redux/actions';

const page = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const [gamesList, setGamesList] = useState()

    const fetchGames = async () => {
        try {
            const {data, status} = await userServices.getGamesList();
            if(status){
                setGamesList(data.games);
                dispatch({type: GAMES_LIST, payload: data.games})
                console.log(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchGames();
    },[]);

    const findNearestTimeSlot = (dates) => {
        const now = moment();
        const today = now.format("YYYY-MM-DD");
        let nearestTimeSlot = null;
        let nearestDate = null;
    
        if (dates[today]) {
          const times = Object.keys(dates[today]);
          for (let time of times) {
            const dateTime = moment(`${today} ${time}`, "YYYY-MM-DD HH:mm");
            if (dateTime.isAfter(now)) {
              nearestTimeSlot = time;
              nearestDate = today;
              break;
            }
          }
        }
    
        if (!nearestTimeSlot) {
          const sortedDates = Object.keys(dates).sort((a, b) =>
            moment(b).diff(moment(a))
          );
          for (let date of sortedDates) {
            if (moment(date).isBefore(now)) {
              const times = Object.keys(dates[date]).sort((a, b) =>
                moment(b, "HH:mm").diff(moment(a, "HH:mm"))
              );
              nearestTimeSlot = times[0];
              nearestDate = date;
              break;
            }
          }
        }
    
        return { nearestTimeSlot, nearestDate };
      };

      const colors = ["#BF6C0B", "#0962AC", "#06849F", "#0F825B","#3069D7"];

      const getRandomColorClass = (index) => {
        return `text-[${colors[index % colors.length]}]`;
      };

      const getRandomBgClass = (index) => {
        return `bg-[${colors[index % colors.length]}]`;
      };

    const isResultTimeNear = (resultTime) => {
        const now = moment();
        const result = moment(resultTime, "HH:mm A");
        const diff = result.diff(now, "minutes");
        return diff >= 0 && diff <= 30; // Within 30 minutes before the result time
      };

    const handleMainGame = (e, game, index) => {
        router.push("/user/gamemain");
        dispatch({type:GAME, payload: game})
    }

    return (
        <div className='min-h-screen text-gray-900' style={{background: `url(${mainBackground?.src})`}}>
             <h1 className="font-medium text-3xl capitalize bg-white h-[90px] w-full  flex items-center justify-center">cash craze game</h1>
             <div className='flex flex-wrap items-start justify-start '>
                {gamesList?.map((game, index) =>  {

                     const color = getRandomColorClass(index);
                     const randomBg = getRandomBgClass(index);
                      
                       const { nearestTimeSlot, nearestDate } = findNearestTimeSlot(game?.dates);
            
                      if (!nearestTimeSlot || !nearestDate) {
                        return null;
                      }
            
                      const winnerNumber = game.dates[nearestDate][nearestTimeSlot];
                      const isNear = moment().isSame(nearestDate, 'day') && moment().isBetween(
                        moment(`${nearestDate} ${nearestTimeSlot}`, "YYYY-MM-DD HH:mm").subtract(30, 'minutes'),
                        moment(`${nearestDate} ${nearestTimeSlot}`, "YYYY-MM-DD HH:mm")
                      );

                     
            
                      const formattedGameName = game?.gameName.split("_").join(" ") || game?.gameName;
                    return(
                    <div className='m-2' key={index}  onClick={(e) => handleMainGame(e, game, index)}>
                        

                    <div className="min-w-[320px] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <div className='flex items-center justify-center h-[70px] gap-4'>

                           
                            <Image
                                src={game?.icon}
                                width={40}
                                height={40}
                                alt='icon'
                            />
                            <h5 className={`mb-2 text-2xl font-semibold tracking-tight ${color}  dark:text-white capitalize `}> { formattedGameName}</h5>
                        </div>
                        
                        <div className='flex items-center justify-around'>
                            <div className='flex flex-col items-center'>
                                <p className="mb-2 text-[21px] font-semibold tracking-tight text-gray-900 dark:text-white"> { "Result Time"}</p>
                                <p className="mb-2 text-[21px] font-semibold tracking-tight text-gray-900 dark:text-white">  {nearestTimeSlot} </p>
                            </div>

                            <p className={`h-[106px] w-[106px] rounded rounded-[50%] ${ isNear ? randomBg : "bg-blue-900"} text-[32px] text-[#fff] flex items-center justify-center p-4`} >
                                {winnerNumber}
                            </p>
                        </div>
                    </div>

                    </div>
                )})}
             </div>
             <Footer />
        </div>
    );
};

export default page;
