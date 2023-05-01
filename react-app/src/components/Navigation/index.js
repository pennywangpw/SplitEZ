import React, { useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className='bg-5cc5a7 pad-tb-25p'>

			{isLoaded && !sessionUser && (
				<ul className='flx-jc-fe mrg20p '>
					<li className='flx gap15p fontS-125rem color-white'>

						<div className='width-50 '>

							<NavLink exact to="/" style={{ textDecoration: 'none' }}>SplitEZ</NavLink>
						</div>

						<div className='width-50 flx gap15p '>
							<div>
								<NavLink to='/login' style={{ textDecoration: 'none' }}>
									Login
								</NavLink>
							</div>

							<div>
								<NavLink to='/signup' style={{ textDecoration: 'none' }}>
									Sign up
								</NavLink>
							</div>
						</div>

					</li>
				</ul>
			)}



			{isLoaded && sessionUser && (

				<>
					<div className='flx-jc-sb mrg-l-7rem mrg-r-3rem fontS-125rem '>
						<Link to="/all" style={{ textDecoration: 'none' }} >
							SplitEZ
						</Link>

						{/* <div className='flx'>
							<form onSubmit={handleSearch} className='bg-blue-0cc pad8p borderR-5p'>

								<i className="fas fa-search mrg-r-8p"></i>

								<input
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									className='bg-blue-0cc border-0 color-white mrg-r-8p'/>
								<button
									disabled={!query}
									type='submit'>Search</button>
							</form>

						</div> */}
						<div className='pos-rel'>
							<ProfileButton user={sessionUser} />
						</div>

					</div>

				</>


			)}

		</div>
	);
}

export default Navigation;
