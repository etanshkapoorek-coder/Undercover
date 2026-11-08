/**
 * hints.js — data for COLD CASE mode.
 *
 * In Cold Case mode everyone except the imposter(s) receives the NAME, while
 * the imposter(s) are told they're the imposter and receive only the HINT.
 *
 * Each line is:   Name | hint
 *
 * HOW TO WRITE A GOOD (TOUGH) HINT
 *  - It must be TRUE, but should fit several other answers in the same category,
 *    so the imposter has to listen to the clues to work out who it is.
 *  - Use background facts: birthplace, schooling, early jobs, family, career path,
 *    first break, where they played or worked, a shared trait.
 *  - Avoid signature facts: famous roles, nicknames, catchphrases, iconic moments,
 *    famous awards, and anything that only fits this one answer.
 *  - Never include the name (or any part of it) in the hint.
 *
 * Categories use the same ids as categories.js. (A line with no hint is ignored;
 * duplicate names within a category are ignored.)
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
Lionel Messi | Left his home country as a young teenager to join a European club's academy
Cristiano Ronaldo | Has played in at least three of Europe's top leagues
Neymar Jr. | Moved from a South American club to Europe in 2013
Ronaldinho | Part of a World Cup-winning squad in 2002
Kylian Mbappé | Scored in a World Cup final before turning 20
Erling Haaland | Born in England but plays for another country
Xavi Hernández | Spent almost his whole career at one club before moving to the Gulf
Andrés Iniesta | Left Europe for Japan later in his career
Pelé | Played most of his club career in a coastal Brazilian city
Diego Maradona | Played club football in Argentina, Spain and Italy
Zinedine Zidane | Played club football in three different countries, ending in Spain
Andrea Pirlo | Moved to a North American league late in his career
David Beckham | Played club football in England, Spain, the United States and France
Steven Gerrard | Captained his club for over a decade
Sergio Ramos | Began as a right-back before becoming a centre-back
Gerard Piqué | Returned to the club that formed him after a spell in Manchester
Luka Modrić | Played in Croatia, England and Spain
Karim Benzema | Left his hometown club in France for Spain in 2009
Robert Lewandowski | Played in Poland, Germany and Spain
Eden Hazard | Left a French club for England in 2012
Mesut Özil | Played in Germany, Spain and England before finishing in Turkey
David Silva | Spent a decade at one English club before returning to Spain
Kevin De Bruyne | Struggled to break through at one English club before thriving at another
Toni Kroos | Born in the former East Germany
Sergio Busquets | Son of a professional goalkeeper
Paolo Maldini | Son of a man who also captained the same famous club
Gianluigi Buffon | Moved to Paris late in his career after nearly two decades at an Italian club
Iker Casillas | Left his one great club for Portugal late in his career
Manuel Neuer | Began his professional career at a club in Germany's Ruhr region
Virgil van Dijk | Played in Scotland before moving to England
Dani Alves | Played for Barcelona, Juventus and Paris Saint-Germain
Roberto Carlos | Played in Turkey and Russia late in his career
Wayne Rooney | Returned to his boyhood club late in his career, then moved to Major League Soccer
Zlatan Ibrahimović | Played for Barcelona and both Milan clubs
Didier Drogba | Played in China, Turkey and North America late in his career
Samuel Eto'o | Won the Champions League with clubs from two different countries
Mohamed Salah | Began his European career in Switzerland
Sadio Mané | Played in France and Austria before reaching England
Harry Kane | Went on loan to several lower-league clubs early in his career
Luis Suárez | Played in the Netherlands, England and Spain
Sergio Agüero | Retired early because of a heart problem
Gareth Bale | Began his career as a left-back before moving forward
Ryan Giggs | Never played at a World Cup or European Championship despite a huge international career
Frank Lampard | His father and uncle were also professional footballers
Thierry Henry | Played for both Juventus and Barcelona
Johan Cruyff | Played in the Netherlands, Spain and the United States
Franz Beckenbauer | Won the World Cup as both a player and a manager
Ronaldo Nazário | Played for both Barcelona and Real Madrid
Kaká | Ended his career in the United States after spells in Italy and Spain
Sunil Chhetri | Had brief spells at clubs in the United States and Portugal
Jude Bellingham | Left an English second-tier club for Germany at 17
Vinícius Júnior | Joined a European club as a teenager before ever playing in Europe
Roberto Baggio | Played for Juventus, both Milan clubs and Fiorentina
Francesco Totti | Played his entire career at one club, in his home city
Peter Schmeichel | Scored goals as a goalkeeper
Patrick Vieira | Born in Africa but played international football for France
Carles Puyol | Played his entire professional career at one club
Rio Ferdinand | Brother of another professional footballer
`;

/* ------------------------------------------------------------------ */
const bollywood = `
Shah Rukh Khan | Born in Delhi and got his start on television in the late 1980s
Aamir Khan | Appeared in a film as a child, directed by his uncle
Salman Khan | Son of a celebrated screenwriter
Akshay Kumar | Taught martial arts in Bangkok before acting
Ranbir Kapoor | Worked behind the camera as an assistant director before acting
Ranveer Singh | Worked as an advertising copywriter before acting
Amitabh Bachchan | Worked at a shipping firm in Calcutta before acting
Dharmendra | Entered films by winning a talent contest
Priyanka Chopra | Studied in the United States as a teenager
Deepika Padukone | Born in Denmark
Kareena Kapoor | Briefly studied law before choosing films
Katrina Kaif | Born in Hong Kong
Hrithik Roshan | Worked as an assistant director for his father before his lead debut
Tiger Shroff | Holds a black belt in taekwondo
Alia Bhatt | Made her debut at 19
Kiara Advani | Changed her first name before her film debut
Vicky Kaushal | Has an engineering degree and a father who works in action choreography
Ayushmann Khurrana | Started as a radio jockey and a reality-TV winner
Shahid Kapoor | Began as a background dancer
Varun Dhawan | Assisted a director before acting
Ajay Devgn | Son of an action director
Emraan Hashmi | Belongs to a family of film-makers on his mother's side
John Abraham | Held an MBA and worked in advertising before modelling
Saif Ali Khan | Studied at a British boarding school
Abhishek Bachchan | Studied in Switzerland and the US before acting
Bobby Deol | Made his lead debut in 1995
Sunny Deol | Was elected to Parliament from Punjab in 2019
Sanjay Dutt | Son of two film stars
Govinda | Won a Lok Sabha seat from Mumbai in 2004
Anil Kapoor | Has a producer brother and an actor brother
Jackie Shroff | Was discovered while standing at a bus stop
Rajesh Khanna | Delivered a famous run of consecutive solo hits around 1970
Dilip Kumar | Born in Peshawar, in present-day Pakistan
Raj Kapoor | Became a director at age 24
Dev Anand | Graduated from a college in Lahore before moving to Bombay
Irrfan Khan | Was a state-level cricketer in his youth
Nawazuddin Siddiqui | Worked as a chemist and a security guard before acting
Rajkummar Rao | Studied at the Film and Television Institute of India
Pankaj Tripathi | Worked in a hotel kitchen in Patna before acting
Manoj Bajpayee | Was rejected multiple times by the National School of Drama
Paresh Rawal | Was elected to Parliament from Ahmedabad East in 2014
Anupam Kher | Trained at the National School of Drama
Madhuri Dixit | Studied microbiology and once aimed for a science career
Sridevi | Started acting as a child in South Indian films
Kajol | Her mother and grandmother were both actresses
Rani Mukerji | Made her debut in a Bengali film
Aishwarya Rai Bachchan | Initially studied architecture
Sushmita Sen | Born in Hyderabad and raised in Delhi
Kangana Ranaut | Left her small town in Himachal Pradesh at 16 to pursue modelling
Vidya Balan | Got her break on a TV sitcom and studied sociology
Anushka Sharma | Born in Uttar Pradesh and raised in Bangalore
Sara Ali Khan | Studied history and political science at an Ivy League college
Shraddha Kapoor | Studied at Boston University before acting
Kriti Sanon | Studied engineering and modelled before acting
Taapsee Pannu | Made her debut in Telugu cinema before moving to Hindi films
Parineeti Chopra | Studied in Manchester and worked in marketing before acting
Hema Malini | Born in Tamil Nadu and trained as a classical dancer
Rekha | Born in Chennai to two film-industry parents
`;

/* ------------------------------------------------------------------ */
const hollywood = `
Leonardo DiCaprio | Started out on a family TV sitcom as a teenager
Brad Pitt | Left university just short of a journalism degree
Tom Cruise | Born in the early 1960s in upstate New York
Tom Hanks | Born in Northern California and broke through on early-1980s television
Robert Downey Jr. | Son of an underground film director
Chris Evans | Grew up in Massachusetts
Dwayne Johnson | Played college football in Florida
Jason Statham | Competed at the Commonwealth Games as a diver
Will Smith | Started his entertainment career as a rapper
Denzel Washington | Got his break on a TV hospital drama in the 1980s
Scarlett Johansson | Began acting as a child in a 1994 film
Jennifer Lawrence | Moved to New York at 14 to pursue acting
Johnny Depp | Was a rock guitarist before turning to acting
Christian Bale | Born in Wales and acted as a child in a Second World War drama
Ryan Reynolds | Canadian who got his start on a teen TV series
Ryan Gosling | Was a member of a children's TV variety club as a kid
Margot Robbie | Australian who got her break on a long-running soap
Emma Stone | Moved to Los Angeles at 15 after pitching her parents a presentation
Matt Damon | Left Harvard before graduating to pursue acting
Ben Affleck | Born in California and raised in Massachusetts
Tom Hardy | Trained at the Drama Centre London
Robert Pattinson | Modelled as a teenager and plays piano and guitar
Timothée Chalamet | Attended a performing arts high school in New York
Tom Holland | Trained as a dancer and debuted in a West End musical
Tobey Maguire | Considered becoming a chef before acting took off
Andrew Garfield | Born in Los Angeles and raised in England
Chris Hemsworth | Middle of three acting brothers
Chris Pratt | Was discovered while waiting tables in Hawaii
Hugh Jackman | Studied journalism before training as an actor in Perth
Russell Crowe | Fronted a rock band and was born in New Zealand
Gerard Butler | Studied law in Scotland before acting
Vin Diesel | Worked as a nightclub bouncer in New York early on
Keanu Reeves | Born in Beirut, Lebanon
Nicolas Cage | Adopted a stage name partly to avoid being linked to a famous relative
Al Pacino | Trained at the Actors Studio in New York
Robert De Niro | Co-founded a New York film festival after 9/11
Morgan Freeman | Served in the US Air Force before acting
Samuel L. Jackson | Became a household name only after turning 40
Sylvester Stallone | Wrote the screenplay for his own breakthrough role
Arnold Schwarzenegger | Born in Austria
Harrison Ford | Worked as a professional carpenter before becoming famous
Bruce Willis | Got his breakthrough on a TV detective comedy-drama
George Clooney | His aunt was a famous mid-century singer
Matthew McConaughey | Switched from law to film studies at the University of Texas
Jim Carrey | Canadian who began doing stand-up comedy as a teenager
Robin Williams | Studied at Juilliard
Adam Sandler | Was dismissed from a famous late-night sketch show
Eddie Murphy | Joined a late-night sketch show at 19
Anne Hathaway | Made her film debut in a Disney movie at 18
Natalie Portman | Born in Jerusalem and attended Harvard
Kate Winslet | Appeared in a breakfast cereal commercial as a child
Meryl Streep | Studied at the Yale School of Drama
Julia Roberts | Her older brother was an established actor before her
Sandra Bullock | Spent much of her childhood in Germany and Austria
Angelina Jolie | Her father is an Oscar-winning actor
Charlize Theron | Trained as a ballet dancer and modelled in Milan before acting
Nicole Kidman | Born in Hawaii to Australian parents
Zendaya | Rose to fame on a Disney Channel series as a teenager
Gal Gadot | Served in the Israeli army and won a national beauty title
Daniel Radcliffe | Made his screen debut in a BBC adaptation of a Dickens novel at age 10
Henry Cavill | Born on the Channel Island of Jersey
Daniel Craig | Began in the National Youth Theatre
Jake Gyllenhaal | His parents are a film director and a screenwriter
Joaquin Phoenix | Went by a different first name as a child
Idris Elba | Worked as a DJ and a nightclub promoter before acting success
Pedro Pascal | Left Chile as an infant and lived in Denmark before the US
Adam Driver | Joined the US Marines after 9/11 before turning to acting
`;

/* ------------------------------------------------------------------ */
const music = `
Michael Jackson | Began his career as a child in a sibling band
Prince | Played nearly every instrument on his own debut album
Beyoncé | Rose to fame in a girl group as a teenager
Rihanna | Was discovered by a US producer who was on holiday on her home island
Ariana Grande | Began as a teen TV actress on a Nickelodeon show
Selena Gomez | Appeared on a children's TV show alongside a purple dinosaur
Taylor Swift | Began in country music before moving to pop
Katy Perry | Released a gospel album under a different name before pop stardom
Drake | Born in Canada's largest city
Kanye West | Became famous as a producer before he was a rapper
Ed Sheeran | Busked and played small gigs as a teenager
Shawn Mendes | Started by posting short cover videos online as a teenager
Adele | Went to a London performing arts school and was signed after demos spread online
Sam Smith | First reached the charts as a guest vocalist on a dance track
Freddie Mercury | Born on an island off the coast of East Africa
Robert Plant | Was set to be an accountant before choosing music
Justin Bieber | Was discovered by a manager browsing online videos
Justin Timberlake | Got his start on a children's TV variety show before a boy band
Bruno Mars | As a child he performed as an impersonator of a famous singer
The Weeknd | Released his first songs online without revealing his identity
Travis Scott | Left a Texas university to pursue music
Kendrick Lamar | Rapped under a different stage name as a teenager
J. Cole | Born on a US military base in Germany
Eminem | Born in Missouri but raised in Detroit
50 Cent | Born and raised in Queens, New York
Jay-Z | Started his own record label to release his first album
Snoop Dogg | Was introduced to the industry through a mixtape that reached a famous producer
Dr. Dre | Began in an electro group in the early 1980s
Tupac Shakur | Attended a performing arts high school in Baltimore
Post Malone | Broke through with a song first uploaded to SoundCloud
Billie Eilish | Writes and produces with her older brother
Lorde | Was signed to a major label as a young teenager
Lana Del Rey | Studied philosophy at a university in New York
Dua Lipa | Moved back to her family's homeland as a child and returned to the UK as a teenager
Doja Cat | Her first viral hit was a novelty song about an animal
Nicki Minaj | Born in Trinidad and Tobago
Cardi B | Became famous through social media and a reality TV series before her music career
Lady Gaga | Enrolled at NYU's arts school before dropping out
Madonna | Arrived in New York City as a young dancer with almost no money
Britney Spears | Born in Mississippi and raised in Louisiana
Mariah Carey | Was discovered when her demo tape reached a record executive at a party
Whitney Houston | Her mother was a famed gospel singer
Celine Dion | Youngest of fourteen children in a Quebec family
Shakira | Recorded her first albums as a teenager in her home country before going global
Jennifer Lopez | Began as a backup dancer on a TV sketch comedy show
Harry Styles | Rose to fame on a TV singing competition as part of a group
Bono | Adopted a stage name given to him by a friend
Mick Jagger | Studied at the London School of Economics
David Bowie | Changed his name to avoid being confused with another famous Davy
Elton John | Studied piano at a London music academy as a child
Paul McCartney | Formed a second major band shortly after the first one broke up
John Lennon | Attended art college in Liverpool
Bob Dylan | Was booed at a folk festival for switching to electric instruments
Elvis Presley | Made his first recordings at a small Memphis label
Frank Sinatra | Born in Hoboken, New Jersey and rose to fame as a teen idol in the 1940s
Jimi Hendrix | Served briefly in the US Army's 101st Airborne
Kurt Cobain | Grew up in a small logging town in Washington state
A. R. Rahman | Played keyboards for another composer before scoring films of his own
Arijit Singh | Started on a TV talent show in the mid-2000s
Sonu Nigam | Began singing at weddings and stage shows with his father as a child
Kumar Sanu | Won the Filmfare award for male playback five years in a row
Shreya Ghoshal | Won a TV singing contest as a teenager before her film debut
Lata Mangeshkar | Began working as a singer and actress at 13 to support her family
Asha Bhosle | Also runs a chain of restaurants
Mohammed Rafi | Born in a village near Amritsar
Kishore Kumar | Younger brother of a veteran actor and also a film actor
Badshah | Studied engineering before turning to music
Yo Yo Honey Singh | Studied music in London before returning to India
Diljit Dosanjh | Began by singing devotional music in his hometown
Guru Randhawa | Also worked as a songwriter for other singers
Bad Bunny | Worked as a supermarket bagger while posting songs online
`;

/* ------------------------------------------------------------------ */
const indianPolitics = `
Jawaharlal Nehru | Studied at Cambridge and trained as a barrister in London
Lal Bahadur Shastri | Offered to resign as railway minister after a train accident
Indira Gandhi | Studied at a university founded by a Nobel-winning poet, then at Oxford
Sonia Gandhi | Met her future husband while studying in Cambridge
Atal Bihari Vajpayee | Was a poet and journalist before politics
L. K. Advani | Born in Karachi
Narendra Modi | Born in a small town in Gujarat
Amit Shah | Studied biochemistry and worked as a stockbroker before politics
Rahul Gandhi | Studied at colleges in the US and England before entering politics
Priyanka Gandhi Vadra | Studied psychology and later pursued Buddhist studies
Mamata Banerjee | Holds a degree in Islamic history and a law degree
Jayalalithaa | Was a trained classical dancer and also a successful actress
Arvind Kejriwal | IIT graduate who joined the civil service before entering politics
Manish Sisodia | Worked as a journalist before activism and politics
Manmohan Singh | Earned degrees at both Cambridge and Oxford
P. V. Narasimha Rao | Known for speaking more than a dozen languages
Sardar Vallabhbhai Patel | Practised as a lawyer in Ahmedabad before politics
Subhas Chandra Bose | Cleared the Indian Civil Service exam but resigned
Mahatma Gandhi | Spent over twenty years in South Africa as a young man
B. R. Ambedkar | Held doctorates from institutions in New York and London
Rajiv Gandhi | Was a commercial airline pilot before politics
Rajnath Singh | Was a physics lecturer before politics
Nitin Gadkari | Earned a nickname for building flyovers
Yogi Adityanath | Is the head priest of a major temple in Gorakhpur
Naveen Patnaik | Was a socialite and author before entering politics
Nitish Kumar | Trained as an electrical engineer before politics
Lalu Prasad Yadav | His wife later served as his state's chief minister
Mulayam Singh Yadav | Was a wrestler and a teacher before politics
Akhilesh Yadav | Studied environmental engineering in Australia
Mayawati | Was a schoolteacher preparing for civil service exams before entering politics
Sharad Pawar | Also served as head of cricket's global governing body
Uddhav Thackeray | Is a wildlife and landscape photographer
Bal Thackeray | Began his career as a cartoonist
Devendra Fadnavis | Became the mayor of his home city in his twenties
Smriti Irani | Worked at a fast-food counter before modelling and acting
Nirmala Sitharaman | Studied at JNU and once worked for the BBC in London
Arun Jaitley | Was a senior advocate in the Supreme Court
Sushma Swaraj | Became the youngest cabinet minister in her state at age 25
Shashi Tharoor | Worked at the United Nations for nearly three decades
M. K. Stalin | Served as mayor of Chennai
M. Karunanidhi | Wrote film dialogue and scripts before and during his political career
M. G. Ramachandran | Was shot and wounded by a fellow actor in 1967
N. T. Rama Rao | Played gods from Hindu epics on screen
Chandrababu Naidu | Started in the Congress party before moving to a regional party
A. P. J. Abdul Kalam | Worked as a newspaper delivery boy as a child
Sarvepalli Radhakrishnan | Held a professorship at Oxford
`;

/* ------------------------------------------------------------------ */
const influential = `
Elon Musk | Born in Pretoria, South Africa
Jeff Bezos | Worked at a hedge fund before starting his company
Bill Gates | Left Harvard to start a company
Steve Jobs | Was adopted as a baby
Nelson Mandela | Co-ran a law firm before years in prison
Martin Luther King Jr. | Entered college at 15
Malcolm X | Changed his name more than once during his life
Marie Curie | Born in Warsaw
Albert Einstein | Worked in a patent office early in his career
Oprah Winfrey | Became a local news anchor while still a teenager
Ellen DeGeneres | Held odd jobs like shucking oysters before starting in comedy
Barack Obama | Became the first Black president of a famed law review
Bill Clinton | Studied at Oxford as a Rhodes Scholar
Warren Buffett | Bought his first stock at 11
Mark Zuckerberg | Built a messaging program for his father's dental office as a kid
Jack Dorsey | Wrote dispatch software for taxis as a teenager
Larry Page | His parents were both computer science professors
Sundar Pichai | Grew up in a modest home in southern India and studied at IIT Kharagpur
Satya Nadella | Played school cricket and studied engineering in Karnataka
Steve Wozniak | Built early computers as a hobbyist in a club
Jack Ma | Taught English before founding a company
Ratan Tata | Studied architecture at a US Ivy League university
Mukesh Ambani | Left a US business school programme to return to the family firm
Gautam Adani | Left college and worked in Mumbai's diamond trade as a young man
Narayana Murthy | Co-founded his company with six others and a tiny starting sum
Azim Premji | Took over the family business at 21 after his father's death
Dhirubhai Ambani | Started out working at a fuel station in Yemen
Stephen Hawking | Voiced himself on an American animated sitcom
Isaac Newton | Later in life ran the Royal Mint
Nikola Tesla | Born in what is now Croatia
Thomas Edison | Held over a thousand US patents
Alexander Graham Bell | Worked as a teacher of the deaf
Charles Darwin | Abandoned medical studies before travelling the world on a ship
Sigmund Freud | Born in what is now the Czech Republic
Malala Yousafzai | Wrote a blog for a major broadcaster as a schoolgirl
Greta Thunberg | Her mother is an opera singer
Mother Teresa | Born in what is now North Macedonia
Princess Diana | Worked as a kindergarten assistant before her marriage
Dalai Lama | Was identified as a reincarnated leader as a toddler
Swami Vivekananda | Founded a mission named after his guru
Rabindranath Tagore | Wrote the words to anthems of two different nations
Vikram Sarabhai | Founded a physical research laboratory in his hometown
C. V. Raman | Worked in the civil accounts service before turning full-time to science
Srinivasa Ramanujan | Became known after writing unsolicited letters to a Cambridge professor
Sachin Tendulkar | Made his international debut as a teenager
Virat Kohli | Captained an Under-19 team to a World Cup title
MS Dhoni | Worked as a ticket collector on the railways
Michelle Obama | Studied at Princeton and then Harvard Law
John F. Kennedy | Won a Pulitzer Prize for a book about senators
Walt Disney | His first animation studio went bankrupt
Henry Ford | Worked at an electric company led by a famous inventor
Sam Altman | Left Stanford to build a location app and later led a startup accelerator
Jensen Huang | Worked at a diner as a teenager before co-founding a chip company
Neil Armstrong | Flew in the Korean War as a naval aviator
Yuri Gagarin | Trained as a metalworker before becoming a pilot
Muhammad Ali | Changed his name after winning a world title
Michael Jordan | Was cut from his high-school varsity team as a sophomore
Usain Bolt | Wanted to be a cricketer as a boy
Serena Williams | Was coached by her father on public courts
`;

/* ------------------------------------------------------------------ */
const heroes = `
Iron Man | Gained his abilities from technology he built himself
Batman | Has no superpowers
Spider-Man | Has a secret identity in New York City
Miles Morales | Took up a mantle from a hero who came before him
Superman | Was born on another world
Captain Marvel | Gained powers from an energy source after an accident
Wolverine | Has heightened senses and an unusually long lifespan
Deadpool | Can heal from almost any injury
Thor | Is a prince by birth
Hercules | Is the son of a god and a mortal woman
The Flash | Gained his ability from a laboratory accident
Quicksilver | Is the sibling of another powerful hero
Black Widow | Was trained from childhood as an assassin
Hawkeye | Uses a ranged weapon rather than superpowers
Daredevil | Has a professional career as a lawyer
Black Panther | Rules a hidden, technologically advanced nation
Doctor Strange | Was a highly paid professional before a life-changing accident
Captain America | Was a soldier in the Second World War
Wonder Woman | Comes from a hidden island of warriors
Hulk | Is a scientist whose experiment went wrong
Aquaman | Is a king
Joker | Has no superpowers and an unknown origin
Harley Quinn | Trained as a doctor before turning to crime
Loki | Was raised as a prince despite being born elsewhere
Thanos | Seeks a set of six powerful stones
Magneto | Survived a wartime atrocity in his youth
Professor X | Founded a school for gifted youngsters
Green Lantern | Joined an interstellar police force
Catwoman | Is a skilled thief with a morally grey side
Krrish | Is an Indian hero whose abilities were inherited
Shaktimaan | Hides his identity behind a clumsy newspaper photographer
Venom | Is a creature that must bond with a host
Ghost Rider | Made a deal with a demon
Ant-Man | Can change his size
Scarlet Witch | Has magical abilities rooted in chaos
Star-Lord | Was abducted from Earth as a child
Green Arrow | Was shipwrecked on an island that shaped him
Nightwing | Was once a sidekick
Shazam | Was chosen by an ancient wizard
`;

/* ------------------------------------------------------------------ */
const food = `
Pizza | Traditionally baked in a very hot domed oven
Calzone | Has its filling sealed inside the dough
Sushi | Typically eaten with soy sauce and a green paste
Sashimi | Is served without rice
Burger | Is traditionally assembled with a bun and eaten by hand
Tacos | Is traditionally eaten by hand from a folded corn or flour wrapper
Burritos | Is sealed on all sides inside a flour wrapper
Ramen | Often finished with a soft egg and sliced pork
Udon | Noodles are served either hot in broth or cold with a dipping sauce
Croissant | Made from layers of butter and dough folded repeatedly
Biryani | Often served with a side of yogurt and cucumber
Pulao | Rice is cooked together with the other ingredients in a measured amount of stock
Butter Chicken | Has a smooth tomato-and-cream sauce and is often eaten with flatbread
Paneer Tikka | Is cooked on skewers in a very hot oven
Dosa | Usually served with chutney and a lentil stew
Idli | Is steamed rather than fried or baked
Samosa | Is deep-fried and filled before cooking
Vada Pav | Is eaten in a bun with garlic chutney
Pav Bhaji | Is eaten by scooping a spiced mash with soft bread
Chole Bhature | Is a heavy breakfast or brunch dish popular in North India
Naan | Traditionally cooked by sticking dough to the walls of a clay oven
Gulab Jamun | Is soaked in sugar syrup after frying
Rasgulla | Is made from curdled milk and is not fried
Jalebi | Is often eaten warm for breakfast in some regions
Kheer | Is made by slowly simmering grains in milk
Lassi | Is a chilled drink based on fermented milk
Pani Puri | Is eaten in a single bite
Momos | Are steamed parcels typically served with a hot red sauce
Pasta | Is made from a simple dough of flour and water or eggs
Lasagna | Is built in layers and baked in a dish
Paella | Is traditionally cooked in a wide shallow pan
Pho | Is served as a broth with noodles and fresh herbs on the side
Shawarma | Meat is cooked on a vertical spit and shaved off
Falafel | Is made from ground legumes and fried
Donut | Is a sweet treat that is fried
Pancake | Is cooked flat on a hot surface and eaten with syrup or toppings
Waffle | Is cooked in a hinged iron
Cheesecake | Has a base of crushed biscuits
Tiramisu | Does not need baking and includes coffee
Ice Cream | Has to be kept frozen to keep its shape
Nachos | Is a snack that is often layered with melted toppings
Hot Dog | Is a staple at ballparks in North America
Fish and Chips | Is typically served wrapped in paper
`;

/* ------------------------------------------------------------------ */
const animals = `
Lion | Lives in a social group where the females do most of the hunting
Tiger | No two individuals share the same pattern
Cheetah | Relies on sprinting rather than stamina to catch prey
Leopard | Often stores its kills up in trees
Jaguar | Kills with an exceptionally strong bite to the skull
Wolf | Lives in a family-based group led by a breeding pair
Fox | Is known for hunting by pouncing on prey beneath snow or grass
Crocodile | Can often be found in saltwater as well as rivers
Alligator | Is found in only two countries
Dolphin | Sleeps with only half its brain at a time
Frog | Lays eggs in water that hatch into swimming larvae
Toad | Spends much of its adult life away from standing water
Butterfly | Starts life as a leaf-eating larva
Moth | Is usually active at night
Camel | Can go for long periods without drinking
Llama | Is used to carry loads in mountainous terrain
Eagle | Can spot prey from remarkably far away
Owl | Can turn its head about 270 degrees
Penguin | Cannot fly but is built for the water
Ostrich | Can run faster than any other bird
Flamingo | Gets its colour from what it eats
Elephant | Is one of the few animals able to recognise itself in a mirror
Rhinoceros | Its horn is made of the same material as hair and fingernails
Hippopotamus | Secretes a natural oily substance that acts like sunscreen
Giraffe | Has the same number of neck bones as most mammals
Zebra | Is a social herd animal whose pattern may deter biting flies
Gorilla | Is the largest living primate and mostly eats plants
Chimpanzee | Fashions simple tools to get food
Panda | Spends most of its day eating plant material it digests poorly
Polar Bear | Has black skin beneath its pale fur
Shark | Has a skeleton made of cartilage rather than bone
Whale | Breathes air but spends its whole life in the sea
Turtle | Returns to land only to lay eggs, in the case of sea species
Cobra | Can flatten the skin of its neck when threatened
Kangaroo | Cannot easily move backwards
Koala | Sleeps for most of the day
Octopus | Has three hearts
Bat | Uses sound to navigate in the dark
Peacock | The male's showy feathers are used for courtship
`;

/* ------------------------------------------------------------------ */
const history = `
Napoleon Bonaparte | Rose to power in the aftermath of a revolution
Julius Caesar | Was once kidnapped by pirates
Cleopatra | Was said to speak many languages
Nefertiti | Ruled alongside a husband who tried to change his country's religion
George Washington | Declined to serve more than two terms
Leonardo da Vinci | Kept thousands of pages of notebooks written in mirror script
Michelangelo | Considered himself a sculptor first
Genghis Khan | Was born with a different name
Alexander the Great | Was tutored as a teenager by a famous philosopher
Winston Churchill | Won a Nobel Prize, but not for peace
Franklin D. Roosevelt | Contracted polio as an adult
Hannibal | Born in North Africa
Attila the Hun | Led a confederation that threatened both halves of the Roman Empire
Ashoka | Changed course after witnessing the aftermath of a war
Chandragupta Maurya | Founded a dynasty with the help of a famed advisor
Akbar | Took the throne at age 13
Shah Jahan | Spent his final years confined by his own son
Aurangzeb | Ruled for roughly half a century
Shivaji | Was crowned in a ceremony at a hill fort
Maharana Pratap | Refused to submit to a powerful emperor
Rani Lakshmibai | Was a woman who led troops in battle
Joan of Arc | Claimed to hear voices telling her to lead an army
Queen Victoria | Came to the throne at 18
Queen Elizabeth I | Never married despite many suitors
Catherine the Great | Was born in a European state other than the one she ruled
Peter the Great | Travelled incognito in Western Europe to learn about shipbuilding
Louis XIV | Had one of the longest reigns in European history
Henry VIII | Broke away from a major church to remarry
Augustus | Was the adopted heir of a famous dictator
Nero | Became emperor as a teenager
Socrates | Wrote nothing himself
Plato | Wrote most of his work as dialogues
Aristotle | Founded a school called the Lyceum
Confucius | Spent years travelling between states seeking an official post
Buddha | Left a life of luxury at about 29
Karl Marx | Spent most of his adult life in exile in London
Christopher Columbus | Was born in a city in Italy but sailed for Spain
Vasco da Gama | Opened a sea route that reshaped trade between two continents
Ferdinand Magellan | Did not survive the voyage that bears his name
Marco Polo | Was born into a Venetian trading family
William Shakespeare | Retired to the small town where he was born
Wolfgang Amadeus Mozart | Toured Europe as a child performer
Ludwig van Beethoven | Was born in Bonn
Tipu Sultan | Experimented with rockets for military use
Razia Sultana | Ruled for only about four years in the 13th century
Tutankhamun | Became ruler as a child
Ramses II | Reigned for over six decades
Hatshepsut | Ruled as a pharaoh despite being a woman
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
