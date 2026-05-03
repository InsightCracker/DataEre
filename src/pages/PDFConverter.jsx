import FileUploader from "../components/FileUploader";

import { 
  Box
} from "@chakra-ui/react";

import {
  FaUserCircle 
} from "react-icons/fa";

const PDFConverter = () => (
  <Box sx={{
    maxW: '600px',
    w: '100%',
    m: '0 auto'
  }} className="converter">
    <div className="nav">
      <div className="">
        <a href="/">Data<span className="dataxo">XO</span></a>
      </div>

      <div>
        <ul>
          <a href="/datahub"><li>Datahub</li></a>
        </ul>
      </div>

      <div>
        <a href="/dashboard" style={{
          fontSize: "1.5rem",
          cursor: "pointer"
        }}>
          <FaUserCircle />
        </a>
      </div>
    </div>

    <div className="uploader">
      <FileUploader />
    </div>

    <div className="upload-card convert-history">
      <h2>Recent Conversion</h2>
    </div>
  </Box>
)

export default PDFConverter