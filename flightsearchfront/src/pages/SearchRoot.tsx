import { useEffect, useState } from "react";
import { getAmadeusData } from "../api/amadeus.api";
import axios from "axios";
import { SearchAutocomplete } from "../components/SearchAutocomplete";
import { SearchCheckboxes } from "../components/SearchCheckboxes";
import { SearchTable } from "../components/SearchTable";
import { SearchAutocomplete2 } from "../components/SearchAutocomplete2";


export interface Search {
  keyword: string;
  city: boolean;
  airport: boolean;
  page: number;
}

export interface DataSource {
  meta: {
    count: number;
  };
  data: any[]; // or more specific type depending on the structure of the data you expect
}

export const SearchRoot = () => {
    /* 
    With new React API we can define state in functional component like this *React.useState*
    1. first element in desctructured array - state itself
    2. second element - dispatch func, that allows us to change state
    3. we can create as many states as we need
  */
    const [search, setSearch] = useState<Search>({
      keyword: "a",
      city: true,
      airport: true,
      page: 0
    });
  
    const [dataSource, setDataSource] = useState<DataSource>({
      meta: { count: 0 },
      data: []
    });
  
    const [loading, setLoading] = useState(false)
  
    /* 
      Also React has lifecycle methods. On of them is *useEffect* - the same as ComponentDidMount | ComponentDidUpdate | ComponentWillUnmount in class components 
      1. First argument is callback func, we define there all logic we need to execute when component mounts
      2. Second argument - array of dependencies. If one of them changing - we executing callback func again
  
      ** If Array is empty - callback will execute only once, when mount
      ** If you not including second argument - callback will execute each time, when component will change
  
      3. We can create as many *useEffect* funcs, as we need
    */
    useEffect(() => {
      // Turn on loader animation
      setLoading(true)
  
  
      /* Getting data from amadeus api.
         out - our data that coming from backend.
         source - token for cancelation request.
      */
  
      const { out, source } = getAmadeusData(search);
      
  
      out.then(res => {
        // If we send too many request to the api per second - we will get an error and app will break
        // Therefore we implemented simple check to prevent error on client side.
        if (!res.data.code) {
          setDataSource(res.data); // dispatching data to components state
        }
        setLoading(false)
      }).catch(err => {
        axios.isCancel(err);
        setLoading(false)
      });
  
      // If we returning function from *useEffect* - then this func will execute, when component will unmount
      return () => {
        source.cancel()
      };
    }, [search]);



  return (
    <div className="container">
      <div className="search-panel">
        <SearchAutocomplete2 />
        {/* <SearchAutocomplete search={search} setSearch={setSearch} /> */}
        <SearchCheckboxes search={search} setSearch={setSearch} />
      </div>
      <SearchTable dataSource={dataSource} search={search} setSearch={setSearch} loading={loading} />
    </div>
  )
}
