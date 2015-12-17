# AnnonLocServer

## API

1. Get nearby locations    
   * GET http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000/nearLocations
    * parameter : longitude, latitude, limit(optional)
2. Get comments by locations_id 
   * GET http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000/locations/id/comments
   * parameter : offset(optional), limit(optional)
3. Post comments to locations
   * POST http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000/locations/id/comments
   * parameter : text, name, icon_id 
4. Get random Name and URL
   * GET  http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000/randomId
5. Get location By locations_id
   * POST http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000/locations/id
   * parameter : limit(optional)
