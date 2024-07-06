'use client'
import React, { useState, useEffect, useMemo } from 'react'
import mainBackground from '../../../public/assets/images/hero-bg.png';
import './dash.css';
import { useRouter } from 'next/navigation';
import { userServices } from '@/lib/userServices';
import { GAME, GAMES_LIST } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const page = () => {

  const router = useRouter();
  const dispatch = useDispatch();

  const [gamesList, setGamesList] = useState();
  const [activeTab, setActiveTab] = useState(1);
  const games = useSelector(state => state.reducer.games);
  const game = useSelector(state => state.reducer.game); 
  const [gameState, setGameState] = useState(game)

 
  const [selectedGame, setSelectedGame] = useState({});
  const [selectedDate, setSelectedDate] = useState('');

  const fetchGames = async () => {
    try {
      
        const {data, status} = await userServices.getGamesList();
        if(status){
            setGamesList(data.games);
            dispatch({type: GAMES_LIST, payload: data.games})
            dispatch({type:GAME, payload: data.games?.[0]})
        }
    } catch (error) {
        console.error(error)
    }
}

useEffect(() => {
    fetchGames();
},[]);

  useEffect(() => {
      setSelectedGame({value:games?.[0]?._id, label: games?.[0]?.gameName});
      setSelectedDate(selectedGameDate);
      setGameState(game);
  },[games, game])

  const today = moment().format('YYYY-MM-DD');

  const gameDates = Object.keys(games?.[0]?.dates || {});

  const selectedGameDate = gameDates.includes(today) ? today : gameDates.sort((a, b) => new Date(b) - new Date(a))[0];

  useEffect(() => {
    if(gameDates.includes(today)){
      return;
    }else{
      let updatedGames = [...games];
      let gameIndexObj = updatedGames.map((item, index) => ({item, index})).filter(({item}) => item?._id === gameState._id)
      if (gameIndexObj.length ===  0) return;
      let gameIndex = gameIndexObj[0].index;

      const { startTime, endTime, interval} = gameState;

      const today = moment().format('YYYY-MM-DD');
      
      // Initialize an empty object for today's intervals
      const todayIntervals = {};

      // Generate the intervals for today's date
      let currentTime = moment(startTime, 'HH:mm');
      const endTimeMoment = moment(endTime, 'HH:mm');
      while (currentTime <= endTimeMoment) {
          todayIntervals[currentTime.format('HH:mm')] = "";
          currentTime = currentTime.add(interval, 'minutes');
      }

      const updatedDates = {[today]: todayIntervals };
      let updatedGamesData = updatedGames[gameIndex] = {...gameState, dates: {...gameState.dates, ...updatedDates}};
  
      // Add today's date with the generated time slots to the dates object
      console.log(updatedGamesData, 'updatedGamesData')
      
      // dispatch({type:GAMES_LIST, payload: updatedGamesData})
    }
  },[game])


  const [columns, setColumns] = useState([]);

  useEffect(() => {

    const details =  game?.dates?.[selectedDate];
  
    console.log( details, 'detials', games, 'date', selectedGameDate);
  
    const entries = details &&  Object.entries(details);
    const rowsPerColumn = 12;
  
    let updateColumns = []
    for (let i = 0; i < entries?.length; i += rowsPerColumn) {
      updateColumns.push(entries.slice(i, i + rowsPerColumn));
    }

    setColumns(updateColumns)

  }, [game,selectedDate])



  console.log(columns,'columns')


  const isDateAvailable = date => {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      return gameDates.includes(formattedDate);
    };
  
    const filterUnavailableDates = date => {
      return isDateAvailable(date);
    };
  
    const handleDateChange = date => {
      let dateselected = moment(date).format('YYYY-MM-DD');
      setSelectedDate(dateselected);
      // Handle any other actions on date change if needed
    };
  
  const handleGameChange = (e) => {
      const value = e.value;
      console.log(value, 'value');
      let newGame = games.filter(game => game._id === e.value)
      setSelectedGame({value: newGame[0]._id, label: newGame[0].gameName});
      console.log(newGame, 'newGame')
      const gameDates = Object.keys(game?.dates || {});
      const selectedGameDate = today;
      setSelectedDate(selectedGameDate);
      setGameState(newGame)
      // dispatch({type: GAME, payload: newGame})
  };

  const handleSearchSelect = () => {
    console.log(selectedGame, 'selectedGameObj')
    const selectedGameObj = games.find(game => game._id === selectedGame.value);
    setSelectedGame({value: selectedGameObj._id, label: selectedGameObj.gameName }|| {});
    setSelectedDate(selectedDate || '');
    setGameState(selectedGameObj)
    
    // dispatch({type: GAME, payload: selectedGameObj});
};

  let options = games?.map(game => ({ value: game._id , label: game.gameName }));

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user')
      router.push('/login')
  }

  const handleTabClick = (e, tab) => {
    setActiveTab(tab)
  }

  const handleChangeBulkUpdate = (e) => {

    const {name, value} = e.target;

    setGameState(prev => ({
      ...prev,
      dates: {
        [selectedDate]: {
          ...prev.dates?.[selectedDate],
          [name]: value
        }
      }
    }))
  }

  console.log(gameState.dates, 'eelectedgame')

  return (
    <div className='min-h-screen text-gray-900' style={{background: `url(${mainBackground?.src})`}}>
      <h1 className="font-medium text-3xl capitalize bg-white h-[90px] w-full  flex items-center justify-center relative">
        <span>
          cash craze game
          </span>

        <button className='bg-red-600 border boder-1 text-white text-[16px] w-[75px] h-[35px]  absolute  right-2'
          onClick={handleLogout}
        > Log out </button>
      </h1>

      <div className="p-2 min-h-full">
        <div className='bg-white rounded rounded-[9px] min-h-full'>
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px dash-tabs">
                  <li className="me-2" onClick={(e) => handleTabClick(e, 1)}>
                      <span className={`inline-block p-4 border-b-2  cursor-pointer rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 font-medium text-[24px] ${activeTab === 1 ? 'active text-blue-600 border-b-2 border-blue-600' : ''}`}> Update Data</span>
                  </li>
                  <li className="me-2"  onClick={(e) => handleTabClick(e, 2)}>
                      <span className={`inline-block p-4   cursor-pointer   rounded-t-lg dark:text-blue-500 dark:border-blue-500 font-medium  text-[24px]  ${activeTab === 2 ? 'active text-blue-600 border-b-2 border-blue-600' : ''}`}  > View Data</span>
                  </li>
                
              </ul>
          </div>
          <div>
          <div className='flex items-center justify-center gap-4'>

            <div className="search-container h-[60px] bg-white border border-1 border-[#000] w-full flex items-center justify-start gap-4">
            <div className='flex items-center justify-center gap-4'>
            <span> Game :</span>

            <Select className={"min-w-[150px]"}
                options={options} 
                value={selectedGame} onChange={(e) => handleGameChange(e)} />
            </div>
                <div className='flex items-center justify-center gap-4'>
                    <span> Date :</span>  
                    <DatePicker
                        className='border border-0 border-b border-[#000] rounded rounded-sm'
                        selected={selectedDate ? moment(selectedDate).toDate() : null}
                        onChange={handleDateChange}
                        filterDate={filterUnavailableDates}
                    />
                </div>
            <button className='rounded rounded-sm search-button bg-[#193CB2] text-white py-2 px-4' onClick={handleSearchSelect}>Search</button>
            </div>
            </div>
          </div>
          <div className=" p-[24px]">

                <div className='flex flex-wrap items-start justify-start  text-white rounded rounded=[8px] '>
                    {columns && columns.map((column, colIndex) => (
                        <div className="column bg-[#193CB2]" key={colIndex}>
                            <div className="header">
                                <div>Time</div>
                                <div>Winner</div>
                            </div>
                            {column.map(([time, value], rowIndex) =>{
                                console.log(`${JSON.stringify(gameState?.dates?.[selectedDate]?.[time])}`, 'gameState?.dates?.selectedDate?.[time]')
                              return(
                                <div className="row" key={rowIndex}>
                                    <div>{time}</div>
                                   <input type="text" className='bg-transparent border  border-b-1 border-[#fff] max-w-[120px]' name={`${time}`} onChange={(e) => handleChangeBulkUpdate(e)} value={`${JSON.stringify(gameState?.dates?.[selectedDate]?.[time])}`} />
                                </div>
                            )})}
                        </div>
                    ))}

                 


                </div>
             </div>


        </div>
      </div>
    </div>
  )
}

export default page
