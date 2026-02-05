import { Redirect, Route, Switch } from 'wouter'
import './styles/globals.css'
import Index from './features'
import GameLogs from './features/phileague/game-logs'
import Rankings from './features/phileague/rankings'
import ScoreEntry from './features/phileague/score-entry'
import GameShuffle from './features/phileague/game-shuffle'
import FourOhFour from './features/four-oh-four'
import ContactUs from './features/contact-us'
import Gallery from './features/gallery'
import Events from './features/events'
import OldCity from './features/locations/old-city'
import Kop from './features/locations/kop'
import Admin from './features/admin'
import League from './features/league'
import { baseUrl, PHILEAGUE_SPA_ROUTES, SPA_ROUTES } from './route-paths'

const Routes = () => (
  <Switch>
    <Route path={SPA_ROUTES.CONTACT_US} component={ContactUs} />
    <Route path={SPA_ROUTES.GALLERY} component={Gallery} />
    <Route path={SPA_ROUTES.EVENTS} component={Events} />
    <Route path={SPA_ROUTES.OLD_CITY} component={OldCity} />
    <Route path={SPA_ROUTES.KOP} component={Kop} />
    <Route path={SPA_ROUTES.ADMIN} component={Admin} />
    <Route path={SPA_ROUTES.LEAGUE} component={League} />
    <Route path={SPA_ROUTES.HOME} component={Index} />
    // Phileague routes
    <Route path={PHILEAGUE_SPA_ROUTES.GAME_LOGS} component={GameLogs} />
    <Route path={PHILEAGUE_SPA_ROUTES.GAME_SHUFFLE} component={GameShuffle} />
    <Route path={PHILEAGUE_SPA_ROUTES.RANKINGS} component={Rankings} />
    <Route path={PHILEAGUE_SPA_ROUTES.SCORE_ENTRY} component={ScoreEntry} />
    // Redirects for legacy routes
    <Route path="/kop.html">
      <Redirect to={SPA_ROUTES.KOP} />
    </Route>
    <Route path="/oldcity.html">
      <Redirect to={SPA_ROUTES.OLD_CITY} />
    </Route>
    <Route path="/oldcity">
      <Redirect to={SPA_ROUTES.OLD_CITY} />
    </Route>
    <Route path="/events.html">
      <Redirect to={SPA_ROUTES.EVENTS} />
    </Route>
    <Route path="/gallery.html">
      <Redirect to={SPA_ROUTES.GALLERY} />
    </Route>
    <Route path="/contact-us.html">
      <Redirect to={SPA_ROUTES.CONTACT_US} />
    </Route>
    <Route path="/admin.html">
      <Redirect to={SPA_ROUTES.ADMIN} />
    </Route>
    <Route path="/gameLogs">
      <Redirect to={PHILEAGUE_SPA_ROUTES.GAME_LOGS} />
    </Route>
    <Route path="/gameLogs.html">
      <Redirect to={PHILEAGUE_SPA_ROUTES.GAME_LOGS} />
    </Route>
    <Route path="/gameShuffle">
      <Redirect to={PHILEAGUE_SPA_ROUTES.GAME_SHUFFLE} />
    </Route>
    <Route path="/gameShuffle.html">
      <Redirect to={PHILEAGUE_SPA_ROUTES.GAME_SHUFFLE} />
    </Route>
    <Route path="/rankings.html">
      <Redirect to={PHILEAGUE_SPA_ROUTES.RANKINGS} />
    </Route>
    <Route path="/scoreEntry">
      <Redirect to={PHILEAGUE_SPA_ROUTES.SCORE_ENTRY} />
    </Route>
    <Route path="/scoreEntry.html">
      <Redirect to={PHILEAGUE_SPA_ROUTES.SCORE_ENTRY} />
    </Route>
    // Keep default route last
    <Route path={baseUrl} component={Index} />
    <Route component={FourOhFour} />
  </Switch>
)

export default Routes
