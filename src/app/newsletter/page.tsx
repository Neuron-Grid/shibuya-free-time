// This is Test code.
// This is likely to change in the future.

// import { env_validation } from "@/utils/env_validation";
// import type { GetStaticProps, NextPage } from "next";

// export const getStaticProps: GetStaticProps<Props> = async () => {
//     return {
//         props: {
//             formUrl: env_validation.form_action_url,
//         },
//     };
// };

// const newsletter: NextPage<Props> = ({ formUrl }) => (
//     <form action={formUrl} method="post">
//         <input type="email" name="email" />
//         <button type="submit">送信</button>
//     </form>
// );

// export default newsletter;

// interface Props {
//     formUrl: string;
// }
import type React from "react";

export const experimental_ppr = true;

const newsletter: React.FC = () => {
    return (
        <div className="container mx-auto p-4 bg-light-background dark:bg-dark-background">
            <div className="text-center">
                <h1 className="text-2xl">Newsletter</h1>
                <p>This is the newsletter page.</p>
            </div>
        </div>
    );
};

export default newsletter;
