import map from "components/map";
import React from "react";

interface TeachButtonProps {
  history: any;
}

const TeachButton: React.FC<TeachButtonProps> = props => {
  return (
    <div className="manage-classes svgOnHover" onClick={() => props.history.push(map.ManageClassroomsTab)}>
      <svg className="svg active" width="250px" height="160px" viewBox="0 0 250 160" fill="currentColor" stroke="none">
        <g className="left-class-icon">
          <path id="Path_8" fill="#E5E8EE" d="M159.737,123.579c11.23,17.258,30.847,21.291,48.259,9.926
            c16.873-11.019,21.256-31.209,10.453-48.157c-11.128-17.445-30.536-21.512-48.171-10.094
            c-17.104,11.075-21.547,31.426-10.545,48.327 M154.229,3.8c-1.394,25.161,0.322,49.404-2.795,73.55
            c0.252-0.149,0.471-0.348,0.646-0.582c9.662-21.365,46.329-35.771,72.565-11.213c22.008,20.603,22.854,52.094,1.41,73.014
            c-15.646,15.271-34.572,22.022-56.063,14.611c-19.909-6.865-30.652-22.231-32.828-42.791c-1.348-12.703-0.798-25.634-0.705-38.462
            c0.126-17.913,0.666-35.825,0.907-53.739c0.032-2.508,0.688-4.11,2.957-5.438C144.766,10.15,149,7.195,154.229,3.8"/>
          <ellipse id="Ellipse_12" transform="matrix(0.5447 0.8386 -0.8386 0.5447 175.7931 -111.6244)" fill="#E5E8EE" cx="190.702" cy="106.092" rx="39.709" ry="42.357" />
          <path id="Path_8-2" fill="#C53D30" d="M206.423,87.009c-6.94,0.007-11.686,4.812-11.669,11.82
            c-0.205,6.312,4.743,11.592,11.053,11.799c0.217,0.006,0.432,0.008,0.647,0.002c6.976,0.062,11.689-4.682,11.699-11.764
            c0.256-6.291-4.637-11.597-10.928-11.853C206.958,87.003,206.688,87.001,206.423,87.009 M241.302,107.456
            c-6.858-5.017-14.026-8.981-20.28-14.299c-0.004,0.098,0.013,0.194,0.045,0.288c4.265,6.656,1.604,19.668-10.156,22.578
            c-9.866,2.438-18.928-3.106-20.9-13.013c-1.442-7.229,0.123-13.819,6.166-18.534c5.597-4.369,11.913-4.582,18.125-1.422
            c3.792,2.079,7.466,4.37,11,6.862c5.046,3.326,10.013,6.769,15.03,10.127c0.677,0.351,1.071,1.076,1,1.836
            c-0.082,1.731-0.023,3.474-0.023,5.576"/>
          <path id="Path_8-3" fill="#C53D30" d="M171.399,87.454c6.838,0.006,11.511,4.739,11.494,11.646
            c0.201,6.215-4.672,11.418-10.889,11.621c-0.211,0.008-0.423,0.008-0.634,0.004c-6.87,0.06-11.516-4.611-11.524-11.589
            c-0.256-6.192,4.561-11.422,10.752-11.676C170.867,87.448,171.134,87.445,171.399,87.454 M137.044,107.593
            c6.755-4.942,13.821-8.85,19.978-14.084c0.004,0.097-0.012,0.193-0.045,0.283c-4.199,6.558-1.58,19.375,10.006,22.24
            c9.72,2.399,18.643-3.062,20.588-12.816c1.425-7.12-0.118-13.612-6.07-18.258c-5.516-4.304-11.733-4.515-17.856-1.401
            c-3.735,2.049-7.354,4.307-10.84,6.762c-4.966,3.277-9.854,6.668-14.8,9.976c-0.665,0.349-1.053,1.063-0.979,1.81
            c0.08,1.707,0.023,3.42,0.023,5.492"/>
        </g>
        <g className="right-class-icon">
          <path id="Path_8-4" fill="#C53D30" d="M90.264,123.581c-11.231,17.257-30.846,21.291-48.258,9.925
            c-16.874-11.017-21.256-31.208-10.453-48.158c11.126-17.44,30.535-21.51,48.168-10.092c17.105,11.075,21.547,31.428,10.547,48.327
            M95.772,3.801c1.394,25.161-0.322,49.404,2.794,73.551c-0.251-0.148-0.47-0.348-0.645-0.582
            c-9.66-21.363-46.329-35.771-72.568-11.213c-22.009,20.603-22.852,52.092-1.41,73.014c15.644,15.271,34.574,22.022,56.065,14.611
            c19.91-6.865,30.653-22.231,32.829-42.791c1.345-12.705,0.797-25.634,0.705-38.463c-0.126-17.914-0.666-35.826-0.908-53.74
            c-0.033-2.508-0.689-4.108-2.956-5.438c-4.443-2.598-8.681-5.555-13.909-8.95"/>
          <ellipse id="Ellipse_12-2" transform="matrix(0.5447 -0.8386 0.8386 0.5447 -61.9637 98.0193)" fill="#C53D30" cx="59.292" cy="106.077" rx="39.71" ry="42.357" />
          <path id="Path_8-5" fill="#1F294E" d="M43.521,87.063c6.942,0.01,11.685,4.813,11.67,11.824
            c0.205,6.311-4.743,11.592-11.053,11.799c-0.216,0.006-0.432,0.008-0.647,0.002c-6.976,0.061-11.69-4.683-11.7-11.766
            c-0.258-6.291,4.634-11.6,10.925-11.855C42.983,87.057,43.253,87.055,43.521,87.063 M8.641,107.51
            c6.858-5.017,14.027-8.982,20.282-14.3c0.004,0.099-0.012,0.196-0.046,0.289c-4.267,6.653-1.605,19.669,10.157,22.576
            c9.87,2.44,18.93-3.104,20.907-13.015c1.443-7.225-0.123-13.815-6.166-18.531c-5.599-4.368-11.916-4.582-18.128-1.422
            c-3.793,2.08-7.465,4.371-11,6.863C19.604,93.297,14.64,96.739,9.619,100.1c-0.675,0.352-1.068,1.078-0.994,1.834
            c0.082,1.732,0.024,3.475,0.024,5.578"/>
          <path id="Path_8-6" fill="#1F294E" d="M78.545,87.508c-6.838,0.006-11.51,4.739-11.494,11.645
            c-0.202,6.217,4.672,11.418,10.887,11.621c0.212,0.009,0.423,0.009,0.635,0.004c6.87,0.06,11.515-4.61,11.524-11.588
            c0.256-6.193-4.559-11.422-10.752-11.676C79.079,87.501,78.813,87.499,78.545,87.508 M112.901,107.645
            c-6.755-4.939-13.817-8.85-19.979-14.084c-0.004,0.098,0.012,0.193,0.045,0.285c4.2,6.555,1.581,19.373-10.005,22.238
            c-9.719,2.4-18.642-3.061-20.589-12.816c-1.421-7.119,0.122-13.611,6.074-18.256c5.514-4.304,11.736-4.516,17.855-1.402
            c3.737,2.051,7.355,4.309,10.839,6.763c4.967,3.274,9.857,6.668,14.801,9.978c0.667,0.344,1.058,1.06,0.985,1.808
            c-0.08,1.706-0.023,3.42-0.023,5.491"/>
        </g>
      </svg>
      <span>Manage Classes</span>
    </div>  
  )
}

export default TeachButton;