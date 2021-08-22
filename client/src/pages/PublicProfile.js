import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import fuzzySearch from 'fz-search';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_USERS} from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';
import Auth from '../utils/auth';

const PublicProfile = props => {
    const { username: userParam } = useParams();

    const [addFriend] = useMutation(ADD_FRIEND);

    const { loading, data } = useQuery(QUERY_USER, {
        variables: { username: userParam }
    });

    const [value, setValue] = useState("");
    const [fuzzyValue, setFuzzyValue] = useState("");

    const { loading: queryUsersLoading, data: usersData} = useQuery(QUERY_USERS);
    console.log(usersData);

    if (loading) {
        return <div>Loading...</div>;
    }
    const user = data.user;

    // if (
    //     Auth.loggedIn() &&
    //     Auth.getProfile().data.username === userParam
    // ) {
    //     return "Welcome to your public profile page!"
    // }
    const handleInputOnChange = e => {
        setValue(e.target.value) 
        const usernames = usersData.users.map(user => user.username)
        const searcher = new fuzzySearch({source: usernames});
        setFuzzyValue(searcher.search(e.target.value))
    }

    const handleClick = async (userid) => {
        try {
            await addFriend({
                variables: { friendId: userid}
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <div className="flex-row mb-3">
                <h2 className="bg-dark text-secondary p-3 display-inline-block">
                    Viewing {userParam ? `${user.username}'s` : 'your'} profile.
                </h2>
                    <ul>
                        {user.playlists.map((playlist) => {
                            
                            return (
                                <li key={'li' + playlist._id}>
                                    <Link
                                        key={playlist._id}
                                        to={`/playlist/${playlist._id}`}
                                    >{playlist.name}</Link>
                                </li>
                            );
                        })}
                </ul>
                {userParam && (
                    // <button className="btn ml-auto" onClick={handleClick}>
                    //     Add Friend
                    // </button>

                    <div> 
                        <p>You currently have x friends</p> 
                        <input value={value} onChange={handleInputOnChange} type="text" />
                         
                        {(fuzzyValue.length > 0 && <div>
                        {fuzzyValue.map(user => <button className="btn ml-auto" onClick={() => handleClick(user)}>
                         Add {user}
                     </button>)}
                        </div>)} 
                        
                    </div>
                )}
            </div>

        </div>
    );
};

export default PublicProfile;
