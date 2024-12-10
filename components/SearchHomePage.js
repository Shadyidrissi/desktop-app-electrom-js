import React from 'react'


// this search will have search about users and category 
function SearchHomePage() {
    return (
        <div id="search">
            <div id='header-search'>
                <input id='input-search' placeholder='Search By Users' type="text" />
                <li id='icon-search'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </li>
            </div>
            <hr/>
            <div id='result-search'>
                <li>
                    <div id='profile-search'>
                        
                    </div>
                    <div id='info-profile-search'>
                        <h5>Title</h5>
                        <p>descp</p>
                    </div>
                </li>
                <li>
                    <div id='profile-search'>
                        
                    </div>
                    <div id='info-profile-search'>
                        <h5>Title</h5>
                        <p>descp</p>
                    </div>
                </li>
            </div>
        </div>
    )
}

export default SearchHomePage