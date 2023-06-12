import { Route, Routes } from "react-router";
import { Home } from "@/components/Home";
import { LoginScreen } from "@/components/LoginScreen";
import Layout from "@/components/common/Layout";
import PrivateRoute from "@/components/common/PrivateRoute";

function App(): JSX.Element {
  // const { token } = useAuth();
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (token) {
  //     // get user data: chats, friends, etc.
  //   }
  // }, [token, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<LoginScreen />} />

        {/* private */}
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404</div>} />
      </Route>
    </Routes>
  );
}

export default App;
