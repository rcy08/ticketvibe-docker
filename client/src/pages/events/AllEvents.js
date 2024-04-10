import * as React from 'react';
import { SERVER_DOMAIN, sortOptions, modeOptions } from '../../constants/index';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import TablePagination from '@mui/material/TablePagination';
import { paginationTheme } from '../../constants';

import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEventContext } from '../../hooks/useEventContext';
import { useLoadingContext } from '../../hooks/useLoadingContext';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { animate, easeInOut, easeOut, motion, spring } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa6";

import { loading2Url, pageTitle } from '../../constants/index';

import EventCard from '../../components/EventCard';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import EventIcon from '@mui/icons-material/Event';
import HomeIcon from '@mui/icons-material/Home';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Button from '@mui/material/Button';
// import Options from '../Options';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { countries } from '../../constants';

import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AllEvents = () => {

    const { loadingDispatch } = useLoadingContext();
    const [events, setEvents] = useState(null);

    const [count, setCount] = useState(0);
    
    const currentUrl = new URL(window.location.href);
    const [searchParams, setSearchParams] = useState(new URLSearchParams(currentUrl.search));
    const [search, setSearch] = useState(searchParams.get('q') || '');

    const searchInput = searchParams.get('q') || '';
    const sortInput = searchParams.get('sort_by') || '';
    const pageInput = searchParams.get('page') || 1;
    const limitInput = searchParams.get('limit') || (window.screen.width < 1024 ? 6 : 8);
    const countryInput = searchParams.get('country');
    const modeInput = searchParams.get('mode');

    const getEvents = async () => {
            
        const response = await fetch(`/api/events?q=${searchInput}&sort=${sortInput}&pageNumber=${Math.max(pageInput, 1)}&pageLimit=${Math.max(limitInput, 1)}&${countryInput && `country=${countryInput}`}&${modeInput && `mode=${modeInput}`}`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
        });
        
        const data = await response.json();
        // console.log(data);
        setEvents(data.events);
        setCount(data.count);

        const maxPage = Math.ceil(data.count / limitInput);
        if(pageInput > maxPage){
            searchParams.set('page', maxPage);
            window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
        }
    
    }
    
    useEffect(() => {
        
        getEvents();

        document.title = pageTitle.events;

        loadingDispatch({ type: 'RESET' });
        
    }, []);

    const handleSearch = (search) => {
        if(search){
            searchParams.set('q', search);
            searchParams.delete('page');
        } 
        else{
            if(!searchParams.get('q')) return;
            searchParams.delete('q');
        } 
        window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
    };


    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const sheetWidth = 350;

    const [state, setState] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
    
        setState(open);
    };

    const list = (anchor) => (
    
        <div className='min-h-screen bg-[#1f2937]'>
    
        <button
          className='fixed top-[15px] right-[15px] text-white rounded-full hover:bg-gray-500 w-fit h-fit'
          onClick={toggleDrawer(false)}
        >
          <CloseIcon />
        </button>
    
        <Box
          sx={{ 
            width: sheetWidth 
          }}
          role="presentation"
          onClick={toggleDrawer(true)}
          onKeyDown={toggleDrawer(true)}
          className='bg-[#1f2937] text-white h-fit p-6'
        >
    
          <List>
            <motion.div 
              className={`border-2 border-gray-${open ? '600' : '400'} my-16 w-full pb-${open ? '6' : '0'} `} 
              variants={{
                hidden: {
                  opacity: 0,
                  x: 25
                },
                show: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.75,
                    type: spring,
                    ease: easeOut
                  }
                }
              }}
              initial='hidden'
              animate='show'
            >
    
              <ListItemButton onClick={handleClick} sx={{ pt : 3, m : 0 }} >
                <div className='flex items-center gap-[6px] mb-4 h-[9px] w-full text-md'> 
                  { !open ? <ChevronRightIcon /> : <ExpandMoreIcon /> }  
                  Filter Events 
                </div> 
              </ListItemButton>
    
              <Collapse in={open} timeout="auto" unmountOnExit>
    
                <List component="div" disablePadding>
    
                  <Autocomplete
                    value={searchParams.get('sort_by')}
                    onChange={(event, newValue) => {
                      if(!newValue){
                        searchParams.delete('sort_by');
                      }
                      else{
                        let copy = searchParams;
                        copy.set('sort_by', newValue.filter);
                        setSearchParams(copy);
                      }
                    }}
                    id="controllable-states-demo"
                    options={sortOptions}
                    renderInput={(params) => 
                      <TextField 
                        {...params} 
                        label="Sort" 
                        style={{
                          backgroundColor: '#ffffff',
                        }}
                      />}
                    className='px-6 pt-6 pb-3 text-white'
                  />
    
                  <Autocomplete
                    value={searchParams.get('mode')}
                    onChange={(event, newValue) => {
                      if(!newValue){
                        searchParams.delete('mode');
                      }
                      else{
                        let copy = searchParams;
                        copy.set('mode', newValue.filter);
                        setSearchParams(copy);
                      }
                    }}
                    id="controllable-states-demo"
                    options={modeOptions}
                    renderInput={(params) => 
                      <TextField 
                        {...params} 
                        label="Mode" 
                        style={{
                          backgroundColor: '#ffffff',
                        }}
                      />}
                    className='px-6 pt-6 pb-3 text-white'
                  />
    
                  <Autocomplete
                    className='mb-2 w-full p-6 text-white'
                    id="country-select-demo"
                    options={countries}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                          alt=""
                        />
                        {option.label} ({option.code}) + {option.phone}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filter by country"
                        style={{
                          backgroundColor: '#ffffff',
                        }}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                      />
                    )}
                    onChange={(e, inputValue) => {
                      if(inputValue){
                        const country = inputValue.label.toLowerCase().split(" ").join("_");
                        let copy = searchParams;
                        copy.set('mode', 'offline');
                        copy.set('country', country);
                        setSearchParams(copy);  
                      }
                      else{
                        let copy = searchParams;
                        copy.delete('mode');
                        copy.delete('country');
                        setSearchParams(copy);  
                      }
                    }}
                  />
                  
                  <div className='w-full flex flex-row justify-center gap-4 mb-4'>
                    <button
                      onClick={() => {
                        window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
                      }}
                      className='flex-end rounded h-fit w-fit'
                    >
                      <Button 
                        variant="outlined"
                        style={{
                          textTransform: 'none',
                          fontSize: '14.5px',
                          padding: '7px 15px',
                          borderColor: '#C2410C',
                          color: '#C2410C',
                          fontWeight: 'bold',
                          backgroundColor: '#171f2a'
                        }}
                      >
                        Apply
                      </Button>
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = '/events';
                      }}
                      className='flex-end rounded h-fit w-fit'
                    >
                      <Button 
                        variant="contained"
                        style={{
                          textTransform: 'none',
                          fontSize: '14.5px',
                          padding: '7px 15px',
                          backgroundColor: '#C2410C',
                        }}
                      >
                        Reset
                      </Button>
                    </button>
                  </div>
                  
                </List>
    
              </Collapse>
    
            </motion.div>
          </List>
        </Box>
        </div>
      );

    return (

        <React.Fragment>
          
          <div className="mt-28 sm:mt-40 lg:mt-44 mb-24 sm:mb-40 md:mb-32 mx-[40px] md:mx-[50px] lg:mx-[60px] ">

            <div className='flex flex-row justify-center items-center mb-12 sm:mb-20'>   
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative w-full sm:w-2/3 xl:w-1/3">
                    <Tooltip title="Click here to search" arrow TransitionComponent={Zoom} className='absolute inset-y-0 left-0 flex items-center h-12 px-[14px] bg-[#383838] rounded'>
                        <button
                            class="absolute inset-y-0 left-0 flex items-center h-12 px-[14px] bg-[#383838] rounded"
                            onClick={() => handleSearch(search)}
                        >
                            <svg class="w-4 h-4 text-[#0015ff] dark:text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </button>    
                    </Tooltip>
                    <Tooltip title='Type here to search'  arrow TransitionComponent={Zoom} className='bg-[#1f2937] block w-full h-12 p-4 pl-16 text-sm text-white border border-gray-400 rounded focus:ring-[#0015ff] focus:border-[#0015ff] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#0015ff] dark:focus:border-[#0015ff] hover:shadow-lg hover:shadow-gray-300'>
                        <input
                            type="text" class="bg-[#1f2937] block w-full h-12 p-4 pl-16 text-sm text-white border border-gray-400 rounded focus:ring-[#0015ff] focus:border-[#0015ff] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#0015ff] dark:focus:border-[#0015ff] hover:shadow-lg hover:shadow-gray-300" placeholder="Search Events" required
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Tooltip>
                    <Tooltip title='Filter Events' arrow TransitionComponent={Zoom} className='hidden sm:flex absolute inset-y-0 right-4 items-center'>
                        <button 
                            className='hidden sm:flex absolute inset-y-0 right-4 items-center'
                            onClick={toggleDrawer(true)}
                        > 
                            <TuneIcon className='text-gray-300 scale-90'/>
                        </button>    
                    </Tooltip>
                    
                    <button 
                        className={`${!search && 'hidden'} flex absolute inset-y-0 right-4 sm:right-12 items-center`}
                        onClick={() => setSearch('')}
                    > 
                        <CloseIcon className='text-gray-300'/>
                    </button>
                </div>
            </div>

            {
                events === null ? 

                <div className='w-full h-[50vh] flex items-center justify-center'>
                    <img src={loading2Url} alt='Loading...' className='w-20 h-20' /> 
                </div>
                    
                    :

            <div>

            
            {events.length === 0 && 
                <div className='flex flex-row justify-center items-center mt-40 mb-32'>
                    <h1 className='font-semibold sm:text-lg'> No events found. Please adjust your filters and try again. </h1> 
                </div>
            }

            <div className='w-full h-full flex flex-row justify-center items-center'>

                <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 sm:gap-7 md:gap-[27px] lg:gap-[32px] max-w-[2000px] ' >

                    {events.map((event, index) => (
                        <motion.div 
                            className='hover:shadow-2xl hover:shadow-gray-300' 
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    y: 100
                                },
                                show: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        type: spring,
                                        duration: 1,
                                        delay: 0.1 * index,
                                        ease: easeInOut
                                    }
                                }
                            }}
                            initial='hidden'
                            animate='show'
                        >

                            <EventCard event={event} />

                        </motion.div>
                    ))}

                </div>
                
            </div>

            <div className={`w-full flex justify-center ${events === null ? 'hidden' : ''}`}>

                <ThemeProvider theme={paginationTheme}>

                    <TablePagination
                        className='mt-28'
                        component="div"
                        count={count}
                        page={Number(pageInput - 1)}
                        onPageChange={(e, page) => {
                            if(page > 0) searchParams.set('page', page + 1);
                            else searchParams.delete('page'); 
                            window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
                        }}
                        rowsPerPage={Number(limitInput)}
                        labelRowsPerPage='Events per page'
                        onRowsPerPageChange={(e) => {
                            if(e.target.value > 0) searchParams.set('limit', e.target.value);
                            else searchParams.delete('limit');
                            window.location.href = `/events?${searchParams.toString()}${currentUrl.hash}`;
                        }}
                        rowsPerPageOptions={[...(Array.from({ length: count }, (_, index) => index + 1)), { value: count, label: 'All' }]}
                        showFirstButton={true}
                        showLastButton={true}
                    />

                </ThemeProvider>

            </div>

            </div>
            
            }

          </div>

          <Drawer
            anchor={'right'}
            open={state}
            onClose={toggleDrawer(false)}
          >
            {list('right')}
          </Drawer>

        </React.Fragment>
    );
}
 
export default AllEvents;