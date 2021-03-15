import React from "react";
interface LoginProps {}

const LoginWheelComponent: React.FC<LoginProps> = () => {
  return (
    <div>
      <defs>
        <pattern id="pattern" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 626 657">
          <image width="626" height="657" xlinkHref="data:image/png;base64,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"/>
        </pattern>
      </defs>
      <svg width="593.462" height="591.748" viewBox="0 0 593.462 591.748" className="bold">
        <g xmlns="http://www.w3.org/2000/svg" id="Group_444" data-name="Group 444" transform="translate(-178.224 -244.187)">
          <g id="Group_403" data-name="Group 403" transform="translate(-890.66 106.757)">
            <g id="Group_327" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_404" data-name="Group 404" transform="matrix(0.985, 0.174, -0.174, 0.985, -793.512, -124.151)">
            <g id="Group_327-2" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-2" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-2" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-2" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-2" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-2" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-2" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-2" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-2" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-2" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_405" data-name="Group 405" transform="translate(-658.479 -333.096) rotate(20)">
            <g id="Group_327-3" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-3" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-3" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-3" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-3" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-3" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-3" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-3" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-3" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-3" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_406" data-name="Group 406" transform="translate(-490.9 -510.18) rotate(30)">
            <g id="Group_327-4" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-4" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-4" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-4" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-4" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-4" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-4" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-4" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-4" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-4" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_407" data-name="Group 407" transform="matrix(0.766, 0.643, -0.643, 0.766, -291.313, -661.578)">
            <g id="Group_327-5" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-5" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-5" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-5" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-5" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-5" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-5" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-5" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-5" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-5" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_408" data-name="Group 408" transform="translate(-69.898 -775.013) rotate(50)">
            <g id="Group_327-6" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-6" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-6" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-6" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-6" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-6" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-6" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-6" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-6" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-6" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_409" data-name="Group 409" transform="matrix(0.454, 0.891, -0.891, 0.454, 243.992, -875.557)">
            <g id="Group_327-7" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-7" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-7" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-7" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-7" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-7" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-7" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-7" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-7" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-7" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_410" data-name="Group 410" transform="translate(493.838 -893.828) rotate(73)">
            <g id="Group_327-8" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-8" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-8" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-8" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-8" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-8" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-8" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-8" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-8" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-8" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_411" data-name="Group 411" transform="translate(741.313 -868.371) rotate(83)">
            <g id="Group_327-9" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-9" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-9" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-9" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-9" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-9" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-9" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-9" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-9" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-9" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_412" data-name="Group 412" transform="translate(975.174 -799.452) rotate(93)">
            <g id="Group_327-10" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-10" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-10" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-10" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-10" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-10" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-10" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-10" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-10" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-10" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_413" data-name="Group 413" transform="matrix(-0.225, 0.974, -0.974, -0.225, 1200.684, -690.352)">
            <g id="Group_327-11" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-11" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-11" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-11" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-11" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-11" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-11" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-11" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-11" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-11" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_414" data-name="Group 414" transform="matrix(-0.391, 0.921, -0.921, -0.391, 1402.273, -544.568)">
            <g id="Group_327-12" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-12" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-12" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-12" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-12" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-12" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-12" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-12" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-12" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-12" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_415" data-name="Group 415" transform="matrix(-0.545, 0.839, -0.839, -0.545, 1579.258, -363.034)">
            <g id="Group_327-13" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-13" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-13" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-13" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-13" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-13" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-13" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-13" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-13" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-13" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_416" data-name="Group 416" transform="translate(1720.004 -155.797) rotate(133)">
            <g id="Group_327-14" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-14" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-14" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-14" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-14" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-14" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-14" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-14" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-14" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-14" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_417" data-name="Group 417" transform="matrix(-0.799, 0.602, -0.602, -0.799, 1821.695, 71.251)">
            <g id="Group_327-15" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-15" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-15" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-15" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-15" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-15" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-15" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-15" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-15" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-15" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_418" data-name="Group 418" transform="translate(1878.941 308.241) rotate(153)">
            <g id="Group_327-16" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-16" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-16" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-16" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-16" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-16" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-16" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-16" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-16" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-16" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_419" data-name="Group 419" transform="matrix(-0.956, 0.292, -0.292, -0.956, 1897.211, 558.086)">
            <g id="Group_327-17" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-17" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-17" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-17" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-17" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-17" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-17" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-17" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-17" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-17" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_420" data-name="Group 420" transform="matrix(-0.993, 0.122, -0.122, -0.993, 1871.754, 805.561)">
            <g id="Group_327-18" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-18" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-18" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-18" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-18" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-18" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-18" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-18" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-18" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-18" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_421" data-name="Group 421" transform="translate(1785.121 1123.572) rotate(-174)">
            <g id="Group_327-19" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-19" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-19" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-19" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-19" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-19" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-19" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-19" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-19" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-19" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_422" data-name="Group 422" transform="translate(1664.367 1343.062) rotate(-164)">
            <g id="Group_327-20" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-20" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-20" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-20" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-20" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-20" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-20" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-20" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-20" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-20" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_423" data-name="Group 423" transform="translate(1508.234 1536.746) rotate(-154)">
            <g id="Group_327-21" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-21" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-21" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-21" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-21" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-21" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-21" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-21" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-21" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-21" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_424" data-name="Group 424" transform="translate(1323.063 1695.343) rotate(-144)">
            <g id="Group_327-22" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-22" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-22" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-22" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-22" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-22" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-22" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-22" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-22" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-22" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_425" data-name="Group 425" transform="matrix(-0.695, -0.719, 0.719, -0.695, 1108.742, 1825.051)">
            <g id="Group_327-23" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-23" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-23" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-23" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-23" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-23" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-23" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-23" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-23" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-23" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_426" data-name="Group 426" transform="translate(876.686 1914.719) rotate(-124)">
            <g id="Group_327-24" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-24" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-24" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-24" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-24" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-24" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-24" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-24" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-24" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-24" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_427" data-name="Group 427" transform="translate(632.217 1962.126) rotate(-114)">
            <g id="Group_327-25" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-25" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-25" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-25" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-25" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-25" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-25" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-25" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-25" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-25" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_428" data-name="Group 428" transform="translate(381.758 1967.295) rotate(-104)">
            <g id="Group_327-26" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-26" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-26" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-26" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-26" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-26" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-26" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-26" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-26" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-26" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_429" data-name="Group 429" transform="matrix(-0.07, -0.998, 0.998, -0.07, 135.955, 1928.922)">
            <g id="Group_327-27" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-27" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-27" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-27" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-27" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-27" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-27" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-27" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-27" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-27" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_430" data-name="Group 430" transform="translate(-93.979 1847.857) rotate(-84)">
            <g id="Group_327-28" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-28" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-28" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-28" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-28" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-28" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-28" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-28" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-28" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-28" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_431" data-name="Group 431" transform="matrix(0.276, -0.961, 0.961, 0.276, -313.469, 1727.104)">
            <g id="Group_327-29" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-29" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-29" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-29" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-29" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-29" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-29" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-29" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-29" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-29" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_432" data-name="Group 432" transform="matrix(0.438, -0.899, 0.899, 0.438, -507.152, 1570.971)">
            <g id="Group_327-30" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-30" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-30" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-30" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-30" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-30" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-30" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-30" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-30" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-30" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_433" data-name="Group 433" transform="matrix(0.629, -0.777, 0.777, 0.629, -726.676, 1325.113)">
            <g id="Group_327-31" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-31" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-31" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-31" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-31" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-31" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-31" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-31" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-31" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-31" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_434" data-name="Group 434" transform="translate(-844.988 1104.298) rotate(-41)">
            <g id="Group_327-32" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-32" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-32" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-32" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-32" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-32" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-32" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-32" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-32" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-32" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_435" data-name="Group 435" transform="translate(-922.391 867.865) rotate(-31)">
            <g id="Group_327-33" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-33" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-33" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-33" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-33" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-33" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-33" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-33" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-33" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-33" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_436" data-name="Group 436" transform="translate(-954.549 626.19) rotate(-21)">
            <g id="Group_327-34" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-34" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-34" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-34" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-34" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-34" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-34" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-34" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-34" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-34" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_437" data-name="Group 437" transform="translate(-946.604 375.802) rotate(-11)">
            <g id="Group_327-35" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-35" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-35" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-35" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-35" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-35" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-35" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-35" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-35" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-35" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
          </g>
          <g id="Group_438" data-name="Group 438" transform="matrix(1, -0.017, 0.017, 1, -895.418, 132.345)">
            <g id="Group_327-36" data-name="Group 327" transform="translate(1344 163.103)">
              <g id="Rectangle_574-36" data-name="Rectangle 574" transform="translate(2 -0.231)" fill="#193366" stroke="#001c55" stroke-width="4">
                <rect width="136" height="279" rx="24" stroke="none" />
                <rect x="2" y="2" width="132" height="275" rx="22" fill="none" />
              </g>
              <rect id="Rectangle_213-36" data-name="Rectangle 213" width="120" height="263" rx="16" transform="translate(10 7.769)" fill="#001c55" />
              <rect id="Rectangle_247-36" data-name="Rectangle 247" width="3" height="13" rx="1.5" transform="translate(0 33.769)" fill="#001c55" />
              <rect id="Rectangle_248-36" data-name="Rectangle 248" width="3" height="18" rx="1.5" transform="translate(0 62.769)" fill="#001c55" />
              <rect id="Rectangle_249-36" data-name="Rectangle 249" width="3" height="18" rx="1.5" transform="translate(0 89.769)" fill="#001c55" />
              <rect id="Rectangle_575-36" data-name="Rectangle 575" width="5" height="41" rx="2.5" transform="translate(135 66.769)" fill="#001c55" />
            </g>
            <path id="Rectangle_1077-36" data-name="Rectangle 1077" d="M14,0h86a14,14,0,0,1,14,14V122a0,0,0,0,1,0,0H14A14,14,0,0,1,0,108V14A14,14,0,0,1,14,0Z" transform="translate(1357 173.872)" fill="#193366" />
            <path id="Rectangle_1078-36" data-name="Rectangle 1078" d="M14,0H114a0,0,0,0,1,0,0V109a14,14,0,0,1-14,14H14A14,14,0,0,1,0,109V14A14,14,0,0,1,14,0Z" transform="translate(1357 307.871)" fill="#fff" />
            <rect id="Image_2-36" data-name="Image 2" width="68" height="71" transform="translate(1380 199.872)" fill="url(#pattern)" />
            <text id="LEARN-36" data-name="LEARN" transform="translate(1371 342.872)" fill="#001c55" font-size="22" font-weight="800" letter-spacing="0.16em"><tspan x="0" y="0">LEARN</tspan></text>
            <text id="TEACH-36" data-name="TEACH" transform="translate(1371 370.889)" fill="#001c55" font-size="22" font-weight="800" letter-spacing="0.16em"><tspan x="0" y="0">TEACH</tspan></text>
            <text id="BUILD-36" data-name="BUILD" transform="translate(1371 400.854)" fill="#001c55" font-size="22" font-weight="800" letter-spacing="0.22em"><tspan x="0" y="0">BUILD</tspan></text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default LoginWheelComponent;
