import { gql } from '@apollo/client';

export const QUERY_PLAYLISTS = gql`
   query playlists($username: String) {
     playlists(username: $username) {
       _id
       name
       createdAt
       username
       members {
            username
        }
       songs {
         _id
         createdAt
         username
         title
         artist
         lyricsUrl
         videoUrl
         performance
       }
     }
   }
 `;

