import { AppBackground } from "@/src/components/generic/AppBackground";
import { AuthBackground } from "@/src/components/auth/AuthBackground";
import { AuthRegisterForm } from "@/src/components/auth/AuthRegisterForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function RegisterScreen() {
  return (
    <AppBackground>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={40}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <AuthBackground>
          <AuthRegisterForm />
        </AuthBackground>
      </KeyboardAwareScrollView>
    </AppBackground>
  );
}
