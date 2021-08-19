import React from 'react';
import Form from 'react-bootstrap/Form';

const SongForm = () => {
   return (
     <Form>
       <Form.Group className="mb-3" controlId="songTitle">
         <Form.Label>Song Title</Form.Label>
         <Form.Control type="text" placeholder="song title" />
       </Form.Group>

       <Form.Group className="mb-3" controlId="songArtist">
         <Form.Label>Artist</Form.Label>
         <Form.Control type="text" placeholder="artist" />
       </Form.Group>

       <Form.Group className="mb-3" controlId="songArtist">
         <Form.Label>Lyrics</Form.Label>
         <Form.Control type="text" placeholder="link to lyrics" />
       </Form.Group>

       <Form.Group className="mb-3" controlId="songArtist">
         <Form.Label>Video</Form.Label>
         <Form.Control type="text" placeholder="link to youtube" />
       </Form.Group>

       <Button variant="primary" type="submit">
         add song!
       </Button>
     </Form>
   );
}

export default SongForm;