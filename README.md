# Group-16-Decentralized-Stock
Decentralized network project for CS 4675/6675

## Searching for User Opinions using Distributed Hast Tables

You can find the forked repository that we contributed to at: https://github.com/vsanupindi/js-libp2p. Clone this repository to run the program.

Multiple user opinion files are already created in folders in the directory 'examples/peer-and-content-routing/stocks/'. Each subfolder contains files in JSON format that contain the user's opinions on different stocks. To create a peer that will add their opinions to the DHT and can query for other peer opinions:

	1. Open a terminal window and navigate to examples/peer-and-content-routing/.
	2. Type 'node content-routing.js -nick=<user nickname>' where the user nickname must correspond to any of the users with stock files in the stocks/ folder. Press enter.
	3. Repeat this process for more peers in new terminal windows. All peers will be joined to the same network.
	4. To query for opinions on a stock, type 'GET <stock ticker symbol>' and press enter. If any entries for the specified stock exist, they will be returned. Otherwise, nothing will be returned.
	5. DHT entries can be dynamically added through typing 'PUT <stock ticker symbol> <user opinion sentence>' and pressing enter. 
