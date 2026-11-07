/**
 * hints.js — data for COLD CASE mode.
 *
 * In Cold Case mode everyone except the imposter(s) receives the NAME, while
 * the imposter(s) are told they're the imposter and receive only the HINT.
 *
 * Each line is:   Name | hint
 *
 * Writing good hints: true, but vague. Never include the name (or part of it).
 * Add more by adding lines — categories use the same ids as categories.js.
 * (A line with no hint is ignored; duplicate names in a category are ignored.)
 */

function parse(block) {
  const seen = new Set();
  return block.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const i = l.indexOf('|');
    if (i === -1) return null;
    return { name: l.slice(0, i).trim(), hint: l.slice(i + 1).trim() };
  }).filter(e => {
    if (!e || !e.name || !e.hint) return false;
    const k = e.name.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/* ------------------------------------------------------------------ */
const football = `
Lionel Messi | Argentine left-footed forward who spent most of his career in Catalonia
Cristiano Ronaldo | Portuguese forward famous for his towering headers and a signature jump celebration
Neymar Jr. | Brazilian forward who has played in both Spain and France
Ronaldinho | Brazil
Kylian Mbappé | French forward known for blistering pace
Erling Haaland | Norwegian striker whose father also played in England
Xavi Hernández | Spanish midfielder who controlled the tempo at Barcelona
Andrés Iniesta | Spanish midfielder who scored in a World Cup final
Pelé | Brazilian who won three World Cups
Diego Maradona | Argentine who scored a famous "Hand of God" goal
Zinedine Zidane | French midfielder remembered for a headbutt in a World Cup final
Andrea Pirlo | Italian playmaker known for long passes and free kicks
David Beckham | English midfielder famous for bending free kicks and fashion
Steven Gerrard | English midfielder who captained Liverpool
Sergio Ramos | Spanish defender known for scoring dramatic late headers
Gerard Piqué | Spanish defender who was married to a famous Colombian singer
Luka Modrić | Croatian midfielder who won the Ballon d'Or in 2018
Karim Benzema | French striker who won the Ballon d'Or in 2022
Robert Lewandowski | Polish striker who scored goals by the dozen in Germany and Spain
Eden Hazard | Belgian winger who starred at Chelsea
Mesut Özil | German playmaker of Turkish heritage who played for Arsenal
David Silva | Spanish playmaker nicknamed "Merlin" at Manchester City
Kevin De Bruyne | Belgian midfielder famed for his passing at Manchester City
Toni Kroos | German midfielder known for pinpoint passing at Real Madrid
Sergio Busquets | Spanish defensive midfielder with a long Barcelona career
Paolo Maldini | Italian defender who spent his entire career at AC Milan
Gianluigi Buffon | Italian goalkeeper who spent many years at Juventus
Iker Casillas | Spanish goalkeeper and long-time Real Madrid captain
Manuel Neuer | German goalkeeper known as a "sweeper-keeper"
Virgil van Dijk | Dutch centre-back who joined Liverpool for a then-record defender fee
Dani Alves | Brazilian right-back who won a huge number of trophies with Barcelona
Roberto Carlos | Brazilian left-back famous for a banana free kick against France
Wayne Rooney | English striker who started his career at Everton
Zlatan Ibrahimović | Swedish striker known for his huge ego and acrobatic goals
Didier Drogba | Ivorian striker who became a Chelsea legend
Samuel Eto'o | Cameroonian striker who won the Champions League with Barcelona and Inter
Mohamed Salah | Egyptian forward nicknamed "the Egyptian King"
Sadio Mané | Senegalese forward who played for Liverpool and Bayern Munich
Harry Kane | English striker who rose through the ranks at Tottenham
Luis Suárez | Uruguayan striker who once famously bit an opponent at a World Cup
Sergio Agüero | Argentine striker who scored a title-winning goal in injury time in 2012
Gareth Bale | Welsh winger famous for a bicycle kick in a Champions League final
Ryan Giggs | Welsh winger who spent his whole club career at Manchester United
Frank Lampard | English midfielder and Chelsea's record goalscorer
Thierry Henry | French striker and Arsenal's all-time top scorer
Johan Cruyff | Dutch legend synonymous with "Total Football"
Franz Beckenbauer | German defender nicknamed "The Emperor"
Ronaldo Nazário | Brazilian striker nicknamed "The Phenomenon"
Kaká | Brazilian midfielder who won the Ballon d'Or in 2007
Sunil Chhetri | Indian forward and his country's all-time top scorer
Jude Bellingham | English midfielder who moved to Real Madrid from Borussia Dortmund
Vinícius Júnior | Brazilian winger who dazzles at Real Madrid
Roberto Baggio | Italian forward with a famous ponytail who missed a penalty in a 1994 World Cup final
Francesco Totti | Italian forward who spent his whole career at Roma
Peter Schmeichel | Danish goalkeeper from Manchester United's 1999 treble-winning side
Patrick Vieira | French midfielder who captained Arsenal's "Invincibles"
Carles Puyol | Curly-haired Spanish defender who captained Barcelona
Rio Ferdinand | English defender who played for West Ham, Leeds and Manchester United
`;

/* ------------------------------------------------------------------ */
const bollywood = `
Shah Rukh Khan | Nicknamed the "King of Bollywood" and known for his arms-wide-open pose
Aamir Khan | Actor famed as a perfectionist who also hosted the TV show Satyamev Jayate
Salman Khan | Actor nicknamed "Bhai" who has long hosted Bigg Boss
Akshay Kumar | Action star who is famous for doing his own stunts and releasing many films a year
Ranbir Kapoor | Grandson of the legendary "Showman" of Indian cinema
Ranveer Singh | Hyper-energetic actor known for flamboyant fashion
Amitabh Bachchan | Veteran with a deep baritone voice who hosts Kaun Banega Crorepati
Dharmendra | Veteran actor called the "He-Man of Bollywood"
Priyanka Chopra | Former Miss World who became a Hollywood star
Deepika Padukone | Actress whose father is a famous badminton champion
Kareena Kapoor | Actress from a famous film dynasty, married to a Pataudi family actor
Katrina Kaif | Hong Kong-born actress who became a Bollywood leading lady
Hrithik Roshan | Actor nicknamed the "Greek God", famed for his dancing
Tiger Shroff | Martial-arts and gymnastics-trained action star
Alia Bhatt | Actress who debuted in Student of the Year and whose father is a filmmaker
Kiara Advani | Actress known for Kabir Singh and Shershaah
Vicky Kaushal | Actor known for the film Uri: The Surgical Strike
Ayushmann Khurrana | Actor-singer known for quirky social comedies
Shahid Kapoor | Actor known for Jab We Met and Kabir Singh
Varun Dhawan | Actor whose father is a director famous for comedies
Ajay Devgn | Actor-director known for playing Singham
Emraan Hashmi | Actor once nicknamed the "serial kisser"
John Abraham | Actor-model famous for his physique and the Dhoom franchise
Saif Ali Khan | Actor from the Pataudi royal family
Abhishek Bachchan | Actor whose parents are both well-known film stars
Bobby Deol | Actor who made a big villain comeback in the film Animal
Sunny Deol | Actor famous for the "dhai kilo ka haath" dialogue
Sanjay Dutt | Actor best known for the Munna Bhai films
Govinda | Actor-comedian famed for his dancing in 1990s comedies
Anil Kapoor | Evergreen actor known for the catchphrase "Jhakaas"
Jackie Shroff | Actor famous for calling everyone "Bhidu"
Rajesh Khanna | Called India's first "superstar"
Dilip Kumar | Legendary actor known as the "Tragedy King"
Raj Kapoor | Called the "Showman" of Indian cinema
Dev Anand | Evergreen romantic star famous for his stylish mannerisms
Irrfan Khan | Actor who appeared in both Slumdog Millionaire and Life of Pi
Nawazuddin Siddiqui | Actor known for Gangs of Wasseypur and Sacred Games
Rajkummar Rao | Actor known for Stree and Newton
Pankaj Tripathi | Actor who played Kaleen Bhaiya in Mirzapur
Manoj Bajpayee | Actor known for Satya and The Family Man
Paresh Rawal | Actor famed as Babu Bhaiya in Hera Pheri
Anupam Kher | Bald veteran actor who has also worked in Hollywood productions
Madhuri Dixit | Actress known for the "Dhak Dhak" song and her dancing
Sridevi | Called the first female superstar of Indian cinema
Kajol | Actress known for DDLJ and Kuch Kuch Hota Hai
Rani Mukerji | Actress known for Black and the Mardaani films
Aishwarya Rai Bachchan | Former Miss World from 1994
Sushmita Sen | Former Miss Universe from 1994
Kangana Ranaut | Actress known for Queen and Tanu Weds Manu
Vidya Balan | Actress who starred in The Dirty Picture
Anushka Sharma | Actress married to a famous cricketer
Sara Ali Khan | Actress whose father is a Pataudi family actor
Shraddha Kapoor | Actress known for Aashiqui 2
Kriti Sanon | Actress who won a National Award for Mimi
Taapsee Pannu | Actress known for Pink and Thappad
Parineeti Chopra | Actress who is a cousin of a global star
Hema Malini | Actress known as the "Dream Girl"
Rekha | Veteran actress best known for Umrao Jaan
`;

/* ------------------------------------------------------------------ */
const hollywood = `
Leonardo DiCaprio | Finally won his first Oscar for playing a frontiersman in The Revenant
Brad Pitt | Starred in Fight Club and was once married to Angelina Jolie
Tom Cruise | He famously does all his own stunts, including hanging off an airplane
Tom Hanks | Beloved actor from Forrest Gump and Cast Away
Robert Downey Jr. | Played a genius billionaire in a powered suit
Chris Evans | Played a super-soldier with a shield
Dwayne Johnson | Former pro wrestler nicknamed "The Rock"
Jason Statham | British action star who was once a competitive diver
Will Smith | Starred in a 90s sitcom set in Bel-Air before Men in Black
Denzel Washington | Won Oscars for Glory and Training Day
Scarlett Johansson | Played Black Widow
Jennifer Lawrence | Played Katniss in The Hunger Games
Johnny Depp | Played a swashbuckling pirate captain
Christian Bale | Method actor who played Batman in Nolan's trilogy
Ryan Reynolds | Plays a fourth-wall-breaking, wise-cracking mercenary
Ryan Gosling | Starred in La La Land and Drive
Margot Robbie | Australian actress who played a famous doll
Emma Stone | Won an Oscar for a musical set in Los Angeles
Matt Damon | Played a spy with amnesia, Jason Bourne
Ben Affleck | Co-wrote Good Will Hunting with a childhood friend
Tom Hardy | Played both Bane and Venom
Robert Pattinson | Played a sparkly vampire before donning a bat cowl
Timothée Chalamet | Starred in Dune and Call Me by Your Name
Tom Holland | Plays a webslinging teen hero
Tobey Maguire | Played the webslinger in the early 2000s films
Andrew Garfield | Played the webslinger in "The Amazing" films
Chris Hemsworth | Australian actor who wields a hammer as a thunder god
Chris Pratt | Played Star-Lord and the raptor trainer in Jurassic World
Hugh Jackman | Australian actor famous for playing a clawed mutant
Russell Crowe | New Zealand-born actor who starred in Gladiator
Gerard Butler | Scottish actor who shouted "This is Sparta!"
Vin Diesel | Plays Dominic Toretto in a street-racing franchise
Keanu Reeves | Starred as Neo and as a retired hitman with a dog
Nicolas Cage | Known for National Treasure and wildly eccentric roles
Al Pacino | Played Michael Corleone in The Godfather
Robert De Niro | Starred in Taxi Driver and Raging Bull
Morgan Freeman | Famed for his soothing narration voice
Samuel L. Jackson | Played an eyepatch-wearing spy chief and Jules in Pulp Fiction
Sylvester Stallone | Star of Rocky and Rambo
Arnold Schwarzenegger | Austrian-born star who later became a governor
Harrison Ford | Played a smuggler captain and an archaeologist with a whip
Bruce Willis | Star of Die Hard
George Clooney | Starred in Ocean's Eleven and the TV drama ER
Matthew McConaughey | Known for saying "alright, alright, alright"
Jim Carrey | Rubber-faced comedian from The Mask and Ace Ventura
Robin Williams | Starred in Mrs. Doubtfire and Good Will Hunting
Adam Sandler | Comedian who starred in Happy Gilmore
Eddie Murphy | Voiced the Donkey in an animated ogre franchise
Anne Hathaway | Starred in The Devil Wears Prada
Natalie Portman | Won an Oscar for Black Swan and played a Star Wars queen
Kate Winslet | Played Rose on a famous doomed ship
Meryl Streep | Holds a record number of Oscar nominations
Julia Roberts | Starred in Pretty Woman
Sandra Bullock | Won an Oscar for The Blind Side
Angelina Jolie | Played a famous tomb raider
Charlize Theron | South African actress who starred in Mad Max: Fury Road
Nicole Kidman | Australian actress who starred in Moulin Rouge!
Zendaya | Starred in Euphoria and as MJ in a webslinger franchise
Gal Gadot | Israeli actress who played an Amazon princess
Daniel Radcliffe | Played a boy wizard
Henry Cavill | Played the Man of Steel and a white-haired monster hunter
Daniel Craig | Played a famous secret agent from 2006 to 2021
Jake Gyllenhaal | Starred in Brokeback Mountain and Nightcrawler
Joaquin Phoenix | Won an Oscar for playing a clown-faced villain
Idris Elba | British actor who starred in The Wire
Pedro Pascal | Chilean-born actor of The Mandalorian and The Last of Us
Adam Driver | Played a conflicted masked villain in the Star Wars sequels
`;

/* ------------------------------------------------------------------ */
const music = `
Michael Jackson | The "King of Pop" famous for the moonwalk
Prince | Purple-loving musician behind Purple Rain
Beyoncé | Former member of Destiny's Child
Rihanna | Barbadian singer behind "Umbrella"
Ariana Grande | Pop singer famous for her high ponytail and whistle notes
Selena Gomez | Former Disney star turned singer and beauty-brand founder
Taylor Swift | Singer famous for her record-breaking "Eras" tour
Katy Perry | Singer of "Roar" and "Firework"
Drake | Canadian rapper who first appeared on a teen TV drama
Kanye West | Rapper, producer and fashion designer from Chicago
Ed Sheeran | Ginger British singer who uses a loop pedal on stage
Shawn Mendes | Canadian singer who first got noticed on Vine
Adele | British singer known for "Hello" and big emotional ballads
Sam Smith | British singer known for "Stay With Me"
Freddie Mercury | Frontman of a legendary British rock band, famed for his moustache
Robert Plant | Golden-maned vocalist of a legendary British rock band
Justin Bieber | Singer who was discovered on YouTube as a young teen
Justin Timberlake | Singer who began in a boy band called *NSYNC
Bruno Mars | Hawaiian-born singer behind "Uptown Funk"
The Weeknd | Canadian singer who headlined a Super Bowl halftime show in 2021
Travis Scott | Houston rapper famous for "Sicko Mode"
Kendrick Lamar | Rapper from Compton who won a Pulitzer Prize
J. Cole | Rapper known for the album 2014 Forest Hills Drive
Eminem | Detroit rapper famous for "Lose Yourself"
50 Cent | Rapper who survived being shot nine times and made "In Da Club"
Jay-Z | Rapper and business mogul married to a superstar
Snoop Dogg | Laid-back West Coast rapper
Dr. Dre | Producer who discovered Eminem and founded Aftermath
Tupac Shakur | Rapper tied to the 1990s East Coast–West Coast rivalry
Post Malone | Tattooed singer-rapper known for "Circles"
Billie Eilish | Young singer known for baggy clothes and "Bad Guy"
Lorde | New Zealand singer who sang "Royals"
Lana Del Rey | Singer known for moody, cinematic ballads like "Summertime Sadness"
Dua Lipa | British-Albanian pop singer of "Levitating"
Doja Cat | Singer-rapper who went viral with "Say So"
Nicki Minaj | Rapper known for flamboyant alter egos
Cardi B | Rapper who got famous through social media before "Bodak Yellow"
Lady Gaga | Singer known for a famous meat dress and "Poker Face"
Madonna | The "Queen of Pop" who sang "Like a Prayer"
Britney Spears | Pop star who burst out with "...Baby One More Time"
Mariah Carey | Singer famed for her whistle register and a Christmas hit
Whitney Houston | Singer of "I Will Always Love You"
Celine Dion | Canadian singer of "My Heart Will Go On"
Shakira | Colombian singer famous for hip-shaking dance moves
Jennifer Lopez | Singer-actress nicknamed "J.Lo"
Harry Styles | Former member of a hugely popular British boy band
Bono | Frontman of an Irish rock band who always wears tinted sunglasses
Mick Jagger | Frontman of a legendary British rock band known for his strut
David Bowie | Shapeshifting rock star with a lightning-bolt face paint alter ego
Elton John | Flamboyant pianist known for "Rocket Man"
Paul McCartney | Former Beatle who wrote "Yesterday"
John Lennon | Former Beatle who wrote "Imagine"
Bob Dylan | Singer-songwriter who won the Nobel Prize in Literature
Elvis Presley | The "King of Rock and Roll"
Frank Sinatra | Crooner nicknamed "Ol' Blue Eyes"
Jimi Hendrix | Left-handed guitar legend who lit his guitar on fire
Kurt Cobain | Frontman of a Seattle grunge band
A. R. Rahman | Composer who won Oscars for Slumdog Millionaire
Arijit Singh | Playback singer known for "Tum Hi Ho"
Sonu Nigam | Playback singer who started performing as a child
Kumar Sanu | Playback singer who ruled the 1990s, famous for Aashiqui
Shreya Ghoshal | Playback singer who debuted with Devdas
Lata Mangeshkar | Playback legend called the "Nightingale of India"
Asha Bhosle | Playback singer and the younger sister of a legendary singer
Mohammed Rafi | Legendary playback singer of the 1950s to 70s
Kishore Kumar | Singer-actor known for his yodeling
Badshah | Indian rapper known for "DJ Waale Babu"
Yo Yo Honey Singh | Punjabi rapper known for "Brown Rang"
Diljit Dosanjh | Punjabi singer-actor who performed at Coachella
Guru Randhawa | Punjabi singer of "Lahore" and "High Rated Gabru"
Bad Bunny | Puerto Rican reggaeton superstar
`;

/* ------------------------------------------------------------------ */
const indianPolitics = `
Jawaharlal Nehru | India's first Prime Minister
Lal Bahadur Shastri | Prime Minister who gave the slogan "Jai Jawan Jai Kisan"
Indira Gandhi | India's first and only woman Prime Minister
Sonia Gandhi | Italian-born long-time president of a major Indian party
Atal Bihari Vajpayee | Poet-politician who served as Prime Minister three times
L. K. Advani | Veteran leader known for a 1990 rath yatra
Narendra Modi | Former Chief Minister of Gujarat who became Prime Minister in 2014
Amit Shah | Political strategist from Gujarat who became Home Minister in 2019
Rahul Gandhi | Member of a famous political dynasty who led the Bharat Jodo Yatra
Priyanka Gandhi Vadra | Congress leader who made her electoral debut in the 2024 Wayanad by-election
Mamata Banerjee | Founder of the Trinamool Congress, known as "Didi"
Jayalalithaa | Tamil Nadu leader and former film star known as "Amma"
Arvind Kejriwal | Former tax officer who founded the Aam Aadmi Party
Manish Sisodia | Former Delhi Deputy Chief Minister known for education reforms
Manmohan Singh | Economist who served as Prime Minister from 2004 to 2014
P. V. Narasimha Rao | Prime Minister who launched economic liberalization in 1991
Sardar Vallabhbhai Patel | "Iron Man of India" who unified the princely states
Subhas Chandra Bose | Leader who formed the Indian National Army
Mahatma Gandhi | "Father of the Nation" known for non-violent resistance
B. R. Ambedkar | Chief architect of the Indian Constitution
Rajiv Gandhi | Youngest Prime Minister at the time, assassinated in 1991
Rajnath Singh | Former Uttar Pradesh Chief Minister who became Defence Minister in 2019
Nitin Gadkari | Minister known for building highways
Yogi Adityanath | Saffron-robed Chief Minister of Uttar Pradesh
Naveen Patnaik | Long-serving Chief Minister of Odisha
Nitish Kumar | Long-serving Chief Minister of Bihar
Lalu Prasad Yadav | Bihar leader famed for his rustic style and a fodder scam case
Mulayam Singh Yadav | Samajwadi Party founder nicknamed "Netaji"
Akhilesh Yadav | Former Uttar Pradesh Chief Minister and son of a party founder
Mayawati | Dalit leader and four-time Uttar Pradesh Chief Minister
Sharad Pawar | Veteran Maharashtra politician who founded the NCP
Uddhav Thackeray | Former Maharashtra Chief Minister and Shiv Sena leader
Bal Thackeray | Founder of the Shiv Sena
Devendra Fadnavis | Maharashtra politician who has served as Chief Minister
Smriti Irani | Former TV actress turned Union Minister
Nirmala Sitharaman | India's first full-time woman Finance Minister
Arun Jaitley | Lawyer-politician who served as Finance Minister
Sushma Swaraj | Former External Affairs Minister known for helping people on Twitter
Shashi Tharoor | Former UN diplomat and author turned Member of Parliament
M. K. Stalin | DMK leader and son of a former Tamil Nadu Chief Minister
M. Karunanidhi | Tamil writer-politician who led the DMK for decades
M. G. Ramachandran | Film star who became Chief Minister of Tamil Nadu
N. T. Rama Rao | Telugu film star who founded the Telugu Desam Party
Chandrababu Naidu | Leader associated with building Hyderabad's IT sector
A. P. J. Abdul Kalam | "Missile Man" who became India's President
Sarvepalli Radhakrishnan | Philosopher and India's second President
`;

/* ------------------------------------------------------------------ */
const influential = `
Elon Musk | Head of a rocket company and an electric car company
Jeff Bezos | Started an online bookstore that grew into a giant
Bill Gates | Co-founded a software giant and runs a huge foundation
Steve Jobs | Co-founder of a tech giant known for black turtlenecks
Nelson Mandela | Spent 27 years in prison before becoming South Africa's president
Martin Luther King Jr. | Civil rights leader who gave the "I Have a Dream" speech
Malcolm X | Civil rights leader who changed his birth surname
Marie Curie | First woman to win a Nobel Prize
Albert Einstein | Physicist behind the theory of relativity
Oprah Winfrey | Talk-show host famous for giving away cars to her audience
Ellen DeGeneres | Talk-show host who voiced a forgetful blue fish
Barack Obama | First Black president of the United States
Bill Clinton | US president of the 1990s who plays the saxophone
Warren Buffett | Investor nicknamed the "Oracle of Omaha"
Mark Zuckerberg | Founded a social network from a college dorm
Jack Dorsey | Co-founder of Twitter
Larry Page | Co-founder of Google
Sundar Pichai | India-born CEO of Google
Satya Nadella | Hyderabad-born CEO of Microsoft
Steve Wozniak | Co-founder who built the first Apple computers
Jack Ma | Founder of Alibaba
Ratan Tata | Late industrialist who led a century-old conglomerate that owns Jaguar Land Rover
Mukesh Ambani | Chairman of Reliance Industries
Gautam Adani | Billionaire who built a conglomerate in ports, airports and energy
Narayana Murthy | Co-founder of Infosys
Azim Premji | Former Wipro chairman known for huge philanthropy
Dhirubhai Ambani | Rags-to-riches founder of Reliance
Stephen Hawking | Physicist who wrote A Brief History of Time
Isaac Newton | Formulated the laws of motion and gravity
Nikola Tesla | Inventor associated with alternating current
Thomas Edison | Inventor associated with the light bulb
Alexander Graham Bell | Credited with inventing the telephone
Charles Darwin | Developed the theory of evolution by natural selection
Sigmund Freud | Founder of psychoanalysis
Malala Yousafzai | Youngest ever Nobel Peace Prize winner
Greta Thunberg | Swedish climate activist known for school strikes
Mother Teresa | Nun who worked among the poor in Kolkata
Princess Diana | Former wife of a British heir to the throne, widely mourned after her death in 1997
Dalai Lama | Tibetan spiritual leader living in exile in India
Swami Vivekananda | Monk who spoke at the 1893 Parliament of the World's Religions in Chicago
Rabindranath Tagore | First non-European to win the Nobel Prize in Literature
Vikram Sarabhai | Called the father of India's space programme
C. V. Raman | Indian physicist whose discovery is celebrated on National Science Day
Srinivasa Ramanujan | Self-taught Indian mathematician
Sachin Tendulkar | Cricketer nicknamed "God of Cricket"
Virat Kohli | Cricketer nicknamed "King" known for chasing down targets
MS Dhoni | Captain who sealed the 2011 World Cup with a six
Michelle Obama | Former First Lady and author of Becoming
John F. Kennedy | US president assassinated in 1963
Walt Disney | Created a famous cartoon mouse
Henry Ford | Introduced the assembly line to car making
Sam Altman | CEO of OpenAI
Jensen Huang | Leather-jacket-wearing CEO of Nvidia
Neil Armstrong | First person to walk on the Moon
Yuri Gagarin | First human in space
Muhammad Ali | Boxer who "floats like a butterfly"
Michael Jordan | Basketball legend of the Chicago Bulls
Usain Bolt | Jamaican sprinter who holds the 100m and 200m world records
Serena Williams | Tennis champion with 23 Grand Slam singles titles
`;

/* ------------------------------------------------------------------ */
const heroes = `
Iron Man | Genius billionaire in a powered suit
Batman | Gotham's billionaire vigilante who has no superpowers
Spider-Man | Teen hero from Queens who gained powers from a radioactive bite
Miles Morales | Brooklyn teen who took up the spider mantle
Superman | Last son of Krypton
Captain Marvel | Former pilot with cosmic energy powers
Wolverine | Mutant with claws and a healing factor
Deadpool | Fourth-wall-breaking mercenary
Thor | Asgardian god of thunder
Hercules | Greek demigod famous for his twelve labors
The Flash | Speedster from Central City
Quicksilver | Super-fast mutant
Black Widow | Spy trained in the Red Room
Hawkeye | Master archer on the Avengers team
Daredevil | Blind lawyer who fights crime in Hell's Kitchen
Black Panther | King of Wakanda
Doctor Strange | Former surgeon turned Sorcerer Supreme
Captain America | WWII super-soldier with a vibranium shield
Wonder Woman | Amazon princess from Themyscira
Hulk | Scientist who turns green when angry
Aquaman | King of Atlantis
Joker | Clown Prince of Crime
Harley Quinn | Former psychiatrist turned villain and antihero
Loki | God of mischief
Thanos | Mad Titan who collected Infinity Stones
Magneto | Master of magnetism
Professor X | Telepathic leader of the X-Men in a wheelchair
Green Lantern | Wields a ring powered by willpower
Catwoman | Cat burglar from Gotham City
Krrish | Indian superhero in a mask, played by Hrithik Roshan
Shaktimaan | Indian TV superhero who spins to transform
Venom | Alien symbiote antihero
Ghost Rider | Skull-faced biker whose head burns with hellfire
Ant-Man | Hero who can shrink in size
Scarlet Witch | Reality-warping sorceress
Star-Lord | Half-human leader of the Guardians of the Galaxy
Green Arrow | Billionaire archer from Star City
Nightwing | Former Robin who left Batman's shadow
Shazam | Boy who says a magic word to become a hero
`;

/* ------------------------------------------------------------------ */
const food = `
Pizza | Round Italian dish topped with melted cheese
Calzone | Folded Italian pizza pocket
Sushi | Japanese vinegared rice dish, often with raw fish
Sashimi | Thinly sliced raw fish from Japan
Burger | Meat patty served in a bun
Tacos | Folded tortilla with fillings from Mexico
Burritos | Large rolled tortilla stuffed with rice and beans
Ramen | Japanese noodle soup
Udon | Thick Japanese wheat noodles
Croissant | Flaky, buttery French pastry
Biryani | Fragrant layered rice dish, famously served in Hyderabad
Pulao | Rice cooked gently in seasoned stock
Butter Chicken | Creamy tomato-based curry that began in Delhi
Paneer Tikka | Grilled, marinated cubes of cottage cheese
Dosa | Crispy fermented crepe from South India
Idli | Soft steamed rice cakes
Samosa | Triangular fried pastry filled with spiced potatoes
Vada Pav | Mumbai's fried potato fritter in a bun
Pav Bhaji | Spiced mashed vegetable curry served with buttered buns
Chole Bhature | Spicy chickpeas served with puffy fried bread
Naan | Leavened flatbread baked in a tandoor
Gulab Jamun | Deep-fried milk dumplings soaked in syrup
Rasgulla | Spongy cheese balls in light syrup, tied to Bengal and Odisha
Jalebi | Orange spiral fried and soaked in syrup
Kheer | Creamy rice pudding
Lassi | Yogurt-based drink
Pani Puri | Crisp hollow shells filled with tangy flavored water
Momos | Steamed dumplings popular in the Himalayas
Pasta | Italian dish made from shaped wheat dough
Lasagna | Layered baked pasta with meat sauce
Paella | Spanish saffron rice dish from Valencia
Pho | Vietnamese noodle soup with herbs
Shawarma | Meat shaved from a rotating spit and wrapped in flatbread
Falafel | Fried chickpea balls from the Middle East
Donut | Ring-shaped fried dough
Pancake | Flat cake cooked on a griddle
Waffle | Grid-patterned batter cake
Cheesecake | Dessert with a creamy filling on a biscuit base
Tiramisu | Coffee-soaked Italian layered dessert
Ice Cream | Frozen churned dessert
Nachos | Tortilla chips topped with melted cheese
Hot Dog | Sausage served in a bun
Fish and Chips | British takeaway classic
`;

/* ------------------------------------------------------------------ */
const animals = `
Lion | Big cat nicknamed the "king of the jungle" that lives in prides
Tiger | Striped big cat that usually hunts alone
Cheetah | Fastest land animal
Leopard | Spotted big cat that rests in trees
Jaguar | Spotted cat from the Americas with a powerful bite
Wolf | Wild canine that howls and lives in packs
Fox | Small, cunning canine with a bushy tail
Crocodile | Reptile with a V-shaped snout
Alligator | Reptile with a U-shaped snout, found in the southern US and China
Dolphin | Intelligent marine mammal that uses echolocation
Frog | Amphibian with smooth skin that leaps
Toad | Bumpy-skinned amphibian
Butterfly | Insect that emerges from a chrysalis
Moth | Nocturnal insect drawn to lights
Camel | Desert animal with humps
Llama | Andean pack animal known for spitting
Eagle | Bird of prey with excellent eyesight
Owl | Nocturnal bird that can rotate its head a long way
Penguin | Flightless bird of the southern hemisphere
Ostrich | Largest bird, which cannot fly
Flamingo | Pink bird often seen standing on one leg
Elephant | Largest land animal, with a trunk
Rhinoceros | Horned, thick-skinned herbivore
Hippopotamus | Huge semi-aquatic African mammal
Giraffe | Tallest land animal
Zebra | Striped African relative of the horse
Gorilla | Largest of the primates
Chimpanzee | Close human relative that uses tools
Panda | Bamboo-eating black-and-white bear
Polar Bear | Arctic carnivore with white fur
Shark | Predatory fish with rows of teeth
Whale | Giant marine mammal
Turtle | Reptile with a shell that lives mostly in water
Cobra | Venomous snake that spreads its hood
Kangaroo | Australian marsupial that hops
Koala | Eucalyptus-eating Australian marsupial
Octopus | Eight-armed sea creature that squirts ink
Bat | The only mammal capable of true flight
Peacock | Bird with a dazzling fan of feathers, and India's national bird
`;

/* ------------------------------------------------------------------ */
const history = `
Napoleon Bonaparte | French emperor who was exiled to Elba and then St Helena
Julius Caesar | Roman dictator assassinated on the Ides of March
Cleopatra | Last active ruler of Ptolemaic Egypt
Nefertiti | Egyptian queen known for her famous painted bust
George Washington | First president of the United States
Leonardo da Vinci | Painter of the Mona Lisa
Michelangelo | Painted the ceiling of the Sistine Chapel
Genghis Khan | Founded the Mongol Empire
Alexander the Great | Macedonian king who conquered much of the known world before turning 33
Winston Churchill | British Prime Minister during most of World War II
Franklin D. Roosevelt | US president elected four times
Hannibal | Carthaginian general who crossed the Alps with elephants
Attila the Hun | Fearsome 5th-century ruler called the "Scourge of God"
Ashoka | Mauryan emperor who embraced Buddhism after the Kalinga War
Chandragupta Maurya | Founded the first empire to unite most of the Indian subcontinent, advised by Chanakya
Akbar | Mughal emperor known for his "Nine Jewels" court
Shah Jahan | Mughal emperor who built the Taj Mahal
Aurangzeb | Mughal emperor who ruled for nearly fifty years
Shivaji | Founder of the Maratha Empire
Maharana Pratap | Mewar king remembered for the Battle of Haldighati
Rani Lakshmibai | Queen of Jhansi who fought in the 1857 uprising
Joan of Arc | French peasant girl who led armies and was burned at the stake
Queen Victoria | British monarch whose long reign names an era
Queen Elizabeth I | English monarch who faced the Spanish Armada
Catherine the Great | German-born empress of Russia
Peter the Great | Russian tsar who founded a new capital on the Baltic coast
Louis XIV | The "Sun King" who built Versailles
Henry VIII | English king with six wives
Augustus | First Roman emperor
Nero | Roman emperor said to have "fiddled while Rome burned"
Socrates | Greek philosopher who was sentenced to drink hemlock
Plato | Founded the Academy in Athens
Aristotle | Philosopher who tutored a famous young conqueror
Confucius | Chinese philosopher associated with the Analects
Buddha | Prince who reached enlightenment under a Bodhi tree
Karl Marx | Co-author of The Communist Manifesto
Christopher Columbus | Italian navigator who sailed west in 1492
Vasco da Gama | Portuguese explorer who reached India by sea in 1498
Ferdinand Magellan | Led the first expedition to sail around the globe
Marco Polo | Venetian merchant who travelled to China
William Shakespeare | The "Bard of Avon"
Wolfgang Amadeus Mozart | Child-prodigy composer from Salzburg
Ludwig van Beethoven | Composer who continued to create music after going deaf
Tipu Sultan | Ruler known as the "Tiger of Mysore"
Razia Sultana | First woman to rule Delhi, in the 13th century
Tutankhamun | Boy pharaoh whose tomb was found in 1922
Ramses II | Egyptian pharaoh known as "the Great"
Hatshepsut | One of ancient Egypt's most successful female pharaohs
`;

/* ------------------------------------------------------------------ */
module.exports = {
  football:        parse(football),
  bollywood:       parse(bollywood),
  indian_politics: parse(indianPolitics),
  hollywood:       parse(hollywood),
  influential:     parse(influential),
  music:           parse(music),
  heroes:          parse(heroes),
  food:            parse(food),
  animals:         parse(animals),
  history:         parse(history),
};
